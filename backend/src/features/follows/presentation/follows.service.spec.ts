import { FollowsService } from './follows.service';
import { NeSuitPasSoiMemeError } from '../domain/errors';
import { ArtisteNotFoundError } from '../../catalog-artists';
import { Utilisateur } from '../../users';
import type { FollowsRepository } from '../domain/follows.repository';
import type { ArtisteRepository } from '../../catalog-artists';
import type { UtilisateurRepository } from '../../users';

describe('FollowsService', () => {
    let followsRepository: jest.Mocked<FollowsRepository>;
    let artisteRepository: jest.Mocked<ArtisteRepository>;
    let utilisateurRepository: jest.Mocked<UtilisateurRepository>;
    let service: FollowsService;

    beforeEach(() => {
        followsRepository = { isFollowing: jest.fn(), follow: jest.fn(), unfollow: jest.fn(), listArtisteIdsFollowed: jest.fn() };
        artisteRepository = { findById: jest.fn(), existsById: jest.fn(), findAll: jest.fn(), save: jest.fn() };
        utilisateurRepository = { findById: jest.fn(), findByEmail: jest.fn(), findByPseudo: jest.fn(), save: jest.fn(), delete: jest.fn() };
        service = new FollowsService(followsRepository, artisteRepository, utilisateurRepository);
    });

    it('refuse de se suivre soi-même', async () => {
        await expect(service.follow('u1', 'u1')).rejects.toThrow(NeSuitPasSoiMemeError);
        expect(artisteRepository.existsById).not.toHaveBeenCalled(); // court-circuite avant même de vérifier l'artiste
    });

    it('refuse de suivre un artiste inexistant', async () => {
        artisteRepository.existsById.mockResolvedValue(false);
        await expect(service.follow('u1', 'a1')).rejects.toThrow(ArtisteNotFoundError);
    });

    it('suit un artiste existant', async () => {
        artisteRepository.existsById.mockResolvedValue(true);
        await service.follow('u1', 'a1');
        expect(followsRepository.follow).toHaveBeenCalledWith('u1', 'a1');
    });

    it('listFollowed() recompose le pseudo depuis users', async () => {
        followsRepository.listArtisteIdsFollowed.mockResolvedValue(['a1']);
        utilisateurRepository.findById.mockResolvedValue(
            Utilisateur.create({
                id: 'a1', pseudo: 'nova', email: 'nova@example.com', motDePasseHash: 'hash',
                oauthProvider: null, oauthId: null, photoProfilUrl: null, statutCompte: 'ACTIF', dateInscription: new Date(),
            }),
        );

        const result = await service.listFollowed('u1');
        expect(result).toEqual([{ id: 'a1', pseudo: 'nova' }]);
    });
});