import { UsersService } from './users.service';
import { Utilisateur } from '../domain/user.entity';
import { PseudoDejaUtiliseError } from '../domain/errors';
import type { UtilisateurRepository } from '../domain/user.repository';
import type { GenreRepository } from '../../catalog-genres';
import type { PreferencesRepository } from '../domain/preferences.repository';

function buildUser(overrides: Partial<Parameters<typeof Utilisateur.create>[0]> = {}) {
    return Utilisateur.create({
        id: 'u1',
        pseudo: 'jane',
        email: 'jane@example.com',
        motDePasseHash: 'hash',
        oauthProvider: null,
        oauthId: null,
        photoProfilUrl: null,
        statutCompte: 'ACTIF',
        dateInscription: new Date(),
        ...overrides,
    });
}

describe('UsersService', () => {
    let repository: jest.Mocked<UtilisateurRepository>;
    let service: UsersService;
    let genreRepository: jest.Mocked<GenreRepository>;
    let preferencesRepository: jest.Mocked<PreferencesRepository>;

    beforeEach(() => {
        repository = {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            findByPseudo: jest.fn(),
            save: jest.fn(),

        };
        genreRepository = { findAll: jest.fn(), findById: jest.fn(), findByNom: jest.fn(), save: jest.fn(), delete: jest.fn() };
        preferencesRepository = { listGenreIds: jest.fn(), replaceGenres: jest.fn() };
        service = new UsersService(repository, preferencesRepository, genreRepository);
    });

    it('refuse de changer de pseudo si déjà pris par un autre utilisateur', async () => {
        const current = buildUser();
        const other = buildUser({ id: 'u2', pseudo: 'bob' });
        repository.findById.mockResolvedValue(current);
        repository.findByPseudo.mockResolvedValue(other);

        await expect(service.updateProfile('u1', { pseudo: 'bob' })).rejects.toThrow(PseudoDejaUtiliseError);
    });

    it('autorise la mise à jour de la photo sans vérifier le pseudo', async () => {
        const current = buildUser();
        repository.findById.mockResolvedValue(current);
        repository.save.mockImplementation(async (u) => u);

        const updated = await service.updateProfile('u1', { photoProfilUrl: 'https://x.com/a.jpg' });

        expect(repository.findByPseudo).not.toHaveBeenCalled();
        expect(updated.photoProfilUrl).toBe('https://x.com/a.jpg');
    });

    it('updateGenrePreferences() refuse un genre inexistant', async () => {
        genreRepository.findById.mockResolvedValue(null);
        await expect(service.updateGenrePreferences('u1', ['g-inconnu'])).rejects.toThrow();
        expect(preferencesRepository.replaceGenres).not.toHaveBeenCalled();
    });
});