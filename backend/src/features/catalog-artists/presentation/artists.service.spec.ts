import { ArtistsService } from './artists.service';
import { Utilisateur } from '../../users';
import { DejaArtisteError, ArtisteNotFoundError } from '../domain/errors';
import type { ArtisteRepository } from '../domain/artiste.repository';
import type { UtilisateurRepository } from '../../users';

function buildUtilisateur() {
    return Utilisateur.create({
        id: 'u1', pseudo: 'jane', email: 'jane@example.com', motDePasseHash: 'hash',
        oauthProvider: null, oauthId: null, photoProfilUrl: null,
        statutCompte: 'ACTIF', dateInscription: new Date(),
    });
}

describe('ArtistsService', () => {
    let artisteRepository: jest.Mocked<ArtisteRepository>;
    let utilisateurRepository: jest.Mocked<UtilisateurRepository>;
    let service: ArtistsService;

    beforeEach(() => {
        artisteRepository = { findById: jest.fn(), existsById: jest.fn(), findAll: jest.fn(), save: jest.fn() };
        utilisateurRepository = { findById: jest.fn(), findByEmail: jest.fn(), findByPseudo: jest.fn(), save: jest.fn() };
        service = new ArtistsService(artisteRepository, utilisateurRepository);
    });

    it('refuse de devenir artiste si deja artiste', async () => {
        utilisateurRepository.findById.mockResolvedValue(buildUtilisateur());
        artisteRepository.existsById.mockResolvedValue(true);

        await expect(service.devenirArtiste('u1')).rejects.toThrow(DejaArtisteError);
    });

    it('cree le profil artiste avec le meme id que l\'utilisateur', async () => {
        utilisateurRepository.findById.mockResolvedValue(buildUtilisateur());
        artisteRepository.existsById.mockResolvedValue(false);
        artisteRepository.save.mockImplementation(async (a) => a);

        const { artiste, pseudo } = await service.devenirArtiste('u1', 'Ma bio');

        expect(artiste.id).toBe('u1');
        expect(pseudo).toBe('jane');
    });

    it('getById() leve une erreur 404 si le profil n\'existe pas', async () => {
        artisteRepository.findById.mockResolvedValue(null);
        await expect(service.getById('inconnu')).rejects.toThrow(ArtisteNotFoundError);
    });
});