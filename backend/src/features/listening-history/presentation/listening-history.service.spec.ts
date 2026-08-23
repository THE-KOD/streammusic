import { ListeningHistoryService } from './listening-history.service';
import { Track } from '../../catalog-tracks';
import { TrackNotFoundError } from '../../catalog-tracks';
import type { HistoriqueRepository } from '../domain/historique.repository';
import type { TrackRepository } from '../../catalog-tracks';

function buildTrack(overrides: Partial<Parameters<typeof Track.create>[0]> = {}) {
    return Track.create({
        id: 't1', albumId: null, artisteId: 'a1', genreId: 'g1', titre: 'T', duree: 200,
        fichierAudioUrl: 'https://x.com/a.mp3', pochetteUrl: null, dateSortie: null,
        nombreEcoutes: 5, dateAjout: new Date(), statutModeration: 'VALIDE', moderateurId: null, dateModeration: null,
        ...overrides,
    });
}

describe('ListeningHistoryService', () => {
    let historiqueRepository: jest.Mocked<HistoriqueRepository>;
    let trackRepository: jest.Mocked<TrackRepository>;
    let service: ListeningHistoryService;

    beforeEach(() => {
        historiqueRepository = { save: jest.fn(), listByUtilisateur: jest.fn(), clearForUtilisateur: jest.fn() };
        trackRepository = { findById: jest.fn(), findAllValide: jest.fn(), findAllByArtiste: jest.fn(), save: jest.fn(), delete: jest.fn() };
        service = new ListeningHistoryService(historiqueRepository, trackRepository);
    });

    it('refuse de logger une écoute sur un titre inexistant', async () => {
        trackRepository.findById.mockResolvedValue(null);
        await expect(service.logListen('u1', 'inconnu', 100)).rejects.toThrow(TrackNotFoundError);
    });

    it("incrémente nombre_ecoutes du titre en plus d'enregistrer l'historique", async () => {
        const track = buildTrack();
        trackRepository.findById.mockResolvedValue(track);
        historiqueRepository.save.mockImplementation(async (e) => e);
        trackRepository.save.mockImplementation(async (t) => t);

        await service.logListen('u1', 't1', 150);

        expect(historiqueRepository.save).toHaveBeenCalled();
        expect(trackRepository.save).toHaveBeenCalledWith(expect.objectContaining({ nombreEcoutes: 6 }));
    });
});