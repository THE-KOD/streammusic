import { AdminService } from './admin.service';
import { Utilisateur } from '../../users';
import { Track } from '../../catalog-tracks';
import { UtilisateurNotFoundError } from '../../users';
import type { UtilisateurRepository } from '../../users';
import type { TrackRepository } from '../../catalog-tracks';

function buildUser(id: string, statutCompte: 'ACTIF' | 'SUSPENDU' = 'ACTIF') {
    return Utilisateur.create({
        id, pseudo: `user-${id}`, email: `${id}@x.com`, motDePasseHash: 'hash', oauthProvider: null, oauthId: null,
        photoProfilUrl: null, statutCompte, dateInscription: new Date(),
    });
}
function buildTrack(id: string, nombreEcoutes: number) {
    return Track.create({
        id, albumId: null, artisteId: 'a1', genreId: 'g1', titre: `T-${id}`, duree: 200,
        fichierAudioUrl: 'https://x.com/a.mp3', pochetteUrl: null, dateSortie: null,
        nombreEcoutes, dateAjout: new Date(), statutModeration: 'VALIDE', moderateurId: null, dateModeration: new Date(),
    });
}

describe('AdminService', () => {
    let utilisateurRepository: jest.Mocked<UtilisateurRepository>;
    let trackRepository: jest.Mocked<TrackRepository>;
    let service: AdminService;

    beforeEach(() => {
        utilisateurRepository = { findById: jest.fn(), findByEmail: jest.fn(), findByPseudo: jest.fn(), findAll: jest.fn(), countAll: jest.fn(), save: jest.fn(), delete: jest.fn() };
        trackRepository = { findById: jest.fn(), findAllValide: jest.fn(), findAllByArtiste: jest.fn(), countByArtiste: jest.fn(), findAllForModeration: jest.fn(), save: jest.fn(), delete: jest.fn() };
        service = new AdminService(utilisateurRepository, trackRepository);
    });

    it('getStats() calcule le total des écoutes et classe les titres populaires', async () => {
        utilisateurRepository.countAll.mockResolvedValue(42);
        trackRepository.findAllValide.mockResolvedValue([buildTrack('t1', 10), buildTrack('t2', 50), buildTrack('t3', 30)]);

        const stats = await service.getStats();
        expect(stats.totalUtilisateurs).toBe(42);
        expect(stats.totalEcoutes).toBe(90);
        expect(stats.titresPopulaires[0].id).toBe('t2');
    });

    it('suspendUser() change le statut du compte', async () => {
        utilisateurRepository.findById.mockResolvedValue(buildUser('u1'));
        utilisateurRepository.save.mockImplementation(async (u) => u);
        const result = await service.suspendUser('u1');
        expect(result.statutCompte).toBe('SUSPENDU');
    });

    it("suspendUser() leve une 404 si l'utilisateur n'existe pas", async () => {
        utilisateurRepository.findById.mockResolvedValue(null);
        await expect(service.suspendUser('inconnu')).rejects.toThrow(UtilisateurNotFoundError);
    });

    it('listTracksForModeration() délègue au repository avec le filtre fourni', async () => {
        trackRepository.findAllForModeration.mockResolvedValue([]);
        await service.listTracksForModeration('EN_ATTENTE');
        expect(trackRepository.findAllForModeration).toHaveBeenCalledWith('EN_ATTENTE');
    });
});