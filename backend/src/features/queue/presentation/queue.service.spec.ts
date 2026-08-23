import { QueueService } from './queue.service';
import { Track, TrackNotFoundError } from '../../catalog-tracks';
import { TitreDejaDansFileError, TitreAbsentDeFileError } from '../domain/errors';
import type { QueueRepository } from '../domain/queue.repository';
import type { TrackRepository } from '../../catalog-tracks';

function buildTrack(id: string) {
    return Track.create({
        id, albumId: null, artisteId: 'a1', genreId: 'g1', titre: 'T', duree: 200,
        fichierAudioUrl: 'https://x.com/a.mp3', pochetteUrl: null, dateSortie: null,
        nombreEcoutes: 0, dateAjout: new Date(), statutModeration: 'VALIDE', moderateurId: null, dateModeration: null,
    });
}

describe('QueueService', () => {
    let queueRepository: jest.Mocked<QueueRepository>;
    let trackRepository: jest.Mocked<TrackRepository>;
    let service: QueueService;

    beforeEach(() => {
        queueRepository = {
            findFileIdByUtilisateur: jest.fn(), createFile: jest.fn(), list: jest.fn(),
            isPresent: jest.fn(), getMaxOrdre: jest.fn(), add: jest.fn(), remove: jest.fn(), reorderAll: jest.fn(), clear: jest.fn(),
        };
        trackRepository = { findById: jest.fn(), findAllValide: jest.fn(), findAllByArtiste: jest.fn(), save: jest.fn(), delete: jest.fn() };
        service = new QueueService(queueRepository, trackRepository);
    });

    it("crée la file au tout premier ajout (creation paresseuse)", async () => {
        trackRepository.findById.mockResolvedValue(buildTrack('t1'));
        queueRepository.findFileIdByUtilisateur.mockResolvedValue(null);
        queueRepository.createFile.mockResolvedValue('f1');
        queueRepository.isPresent.mockResolvedValue(false);
        queueRepository.getMaxOrdre.mockResolvedValue(0);

        await service.addTrack('u1', 't1');

        expect(queueRepository.createFile).toHaveBeenCalledWith('u1');
        expect(queueRepository.add).toHaveBeenCalledWith('f1', 't1', 1);
    });

    it('ne recrée pas la file si elle existe déjà', async () => {
        trackRepository.findById.mockResolvedValue(buildTrack('t2'));
        queueRepository.findFileIdByUtilisateur.mockResolvedValue('f1');
        queueRepository.isPresent.mockResolvedValue(false);
        queueRepository.getMaxOrdre.mockResolvedValue(1);

        await service.addTrack('u1', 't2');

        expect(queueRepository.createFile).not.toHaveBeenCalled();
    });

    it('refuse un titre déjà présent dans la file', async () => {
        trackRepository.findById.mockResolvedValue(buildTrack('t1'));
        queueRepository.findFileIdByUtilisateur.mockResolvedValue('f1');
        queueRepository.isPresent.mockResolvedValue(true);
        await expect(service.addTrack('u1', 't1')).rejects.toThrow(TitreDejaDansFileError);
    });

    it("list() renvoie une liste vide si aucune file n'existe encore, sans erreur", async () => {
        queueRepository.findFileIdByUtilisateur.mockResolvedValue(null);
        const result = await service.list('u1');
        expect(result).toEqual([]);
    });

    it("removeTrack() leve une erreur si aucune file n'existe", async () => {
        queueRepository.findFileIdByUtilisateur.mockResolvedValue(null);
        await expect(service.removeTrack('u1', 't1')).rejects.toThrow(TitreAbsentDeFileError);
    });
});