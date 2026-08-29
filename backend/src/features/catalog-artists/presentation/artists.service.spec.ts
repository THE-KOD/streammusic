import { ArtistsService } from './artists.service';
import { Utilisateur } from '../../users';
import { DejaArtisteError, ArtisteNotFoundError } from '../domain/errors';
import type { ArtisteRepository } from '../domain/artiste.repository';
import type { UtilisateurRepository } from '../../users';
import {Artiste} from "../domain/artiste.entity";

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
        utilisateurRepository = { findById: jest.fn(), findByEmail: jest.fn(), findByPseudo: jest.fn(), findAll: jest.fn(), countAll: jest.fn(), save: jest.fn(), delete: jest.fn() };
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

    it('getById() inclut la photo de profil de l\'utilisateur', async () => {
        const artiste = Artiste.create({ id: 'a1', biographie: null, photoArtisteUrl: null });
        artisteRepository.findById.mockResolvedValue(artiste);
        utilisateurRepository.findById.mockResolvedValue(
            Utilisateur.create({ id: 'a1', pseudo: 'jane', email: 'j@x.com', motDePasseHash: 'h', oauthProvider: null, oauthId: null, photoProfilUrl: 'https://x.com/p.jpg', statutCompte: 'ACTIF', dateInscription: new Date() }),
        );
        const result = await service.getById('a1');
        expect(result.photoProfilUrl).toBe('https://x.com/p.jpg');
    });
});