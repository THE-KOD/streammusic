import { TracksService } from './tracks.service';
import { Track } from '../domain/track.entity';
import { Album } from '../../catalog-albums';
import { Genre } from '../../catalog-genres';
import { ForbiddenError } from '../../../core/errors';
import type { TrackRepository } from '../domain/track.repository';
import type { ArtisteRepository } from '../../catalog-artists';
import type { GenreRepository } from '../../catalog-genres';
import type { AlbumRepository } from '../../catalog-albums';

describe('TracksService', () => {
    let trackRepository: jest.Mocked<TrackRepository>;
    let artisteRepository: jest.Mocked<ArtisteRepository>;
    let genreRepository: jest.Mocked<GenreRepository>;
    let albumRepository: jest.Mocked<AlbumRepository>;
    let service: TracksService;

    beforeEach(() => {
        trackRepository = { findById: jest.fn(), findAllValide: jest.fn(), findAllByArtiste: jest.fn(), findAllForModeration: jest.fn(), save: jest.fn(), delete: jest.fn() };
        artisteRepository = { findById: jest.fn(), existsById: jest.fn(), findAll: jest.fn(), save: jest.fn() };
        genreRepository = { findAll: jest.fn(), findById: jest.fn(), findByNom: jest.fn(), save: jest.fn(), delete: jest.fn() };
        albumRepository = { findById: jest.fn(), existsById: jest.fn(), findAll: jest.fn(), findByArtisteId: jest.fn(), save: jest.fn(), delete: jest.fn() };
        service = new TracksService(trackRepository, artisteRepository, genreRepository, albumRepository, { emit: jest.fn() } as any);
    });

    it("refuse de créer un titre dans l'album d'un autre artiste", async () => {
        artisteRepository.existsById.mockResolvedValue(true);
        genreRepository.findById.mockResolvedValue(Genre.create({ id: 'g1', nom: 'Pop' }));
        albumRepository.findById.mockResolvedValue(
            Album.create({ id: 'al1', artisteId: 'AUTRE_ARTISTE', titre: 'T', pochetteUrl: null, dateSortie: '2026-01-01' }),
        );

        await expect(
            service.create('a1', { titre: 'Titre', genreId: 'g1', albumId: 'al1', duree: 200, fichierAudioUrl: 'https://x.com/a.mp3' }),
        ).rejects.toThrow(ForbiddenError);
    });

    it('crée un titre en single (sans album) sans vérifier de propriétaire', async () => {
        artisteRepository.existsById.mockResolvedValue(true);
        genreRepository.findById.mockResolvedValue(Genre.create({ id: 'g1', nom: 'Pop' }));
        trackRepository.save.mockImplementation(async (t) => t);

        const track = await service.create('a1', { titre: 'Single', genreId: 'g1', duree: 180, fichierAudioUrl: 'https://x.com/a.mp3' });

        expect(track.albumId).toBeNull();
        expect(track.statutModeration).toBe('EN_ATTENTE');
        expect(albumRepository.findById).not.toHaveBeenCalled();
    });

    it("refuse la modification d'un titre par un artiste qui n'en est pas propriétaire", async () => {
        const track = Track.create({
            id: 't1', albumId: null, artisteId: 'a1', genreId: 'g1', titre: 'T', duree: 200,
            fichierAudioUrl: 'https://x.com/a.mp3', pochetteUrl: null, dateSortie: null,
            nombreEcoutes: 0, dateAjout: new Date(), statutModeration: 'EN_ATTENTE',
            moderateurId: null, dateModeration: null,
        });
        trackRepository.findById.mockResolvedValue(track);

        await expect(service.update('t1', 'a2', { titre: 'Nouveau' })).rejects.toThrow(ForbiddenError);
    });

    it('moderer() avec VALIDE change le statut', async () => {
        const track = Track.create({
            id: 't1', albumId: null, artisteId: 'a1', genreId: 'g1', titre: 'T', duree: 200,
            fichierAudioUrl: 'https://x.com/a.mp3', pochetteUrl: null, dateSortie: null,
            nombreEcoutes: 0, dateAjout: new Date(), statutModeration: 'EN_ATTENTE',
            moderateurId: null, dateModeration: null,
        });
        trackRepository.findById.mockResolvedValue(track);
        trackRepository.save.mockImplementation(async (t) => t);

        const result = await service.moderer('t1', 'VALIDE', 'admin-1');
        expect(result.statutModeration).toBe('VALIDE');
    });

    it("émet TRACK_UNPUBLISHED_EVENT quand un titre est rejeté", async () => {
        const track = Track.create({
            id: 't1', albumId: null, artisteId: 'a1', genreId: 'g1', titre: 'T', duree: 200,
            fichierAudioUrl: 'https://x.com/a.mp3', pochetteUrl: null, dateSortie: null,
            nombreEcoutes: 0, dateAjout: new Date(), statutModeration: 'EN_ATTENTE', moderateurId: null, dateModeration: null,
        });
        trackRepository.findById.mockResolvedValue(track);
        trackRepository.save.mockImplementation(async (t) => t);
        const emit = jest.fn();
        const svc = new TracksService(trackRepository, artisteRepository, genreRepository, albumRepository, { emit } as any);

        await svc.moderer('t1', 'REJETE', 'admin-1');
        expect(emit).toHaveBeenCalledWith('track.unpublished', expect.objectContaining({ titreId: 't1' }));
    });

    it("émet TRACK_UNPUBLISHED_EVENT quand un titre validé est modifié (repasse EN_ATTENTE)", async () => {
        const track = Track.create({
            id: 't1', albumId: null, artisteId: 'a1', genreId: 'g1', titre: 'T', duree: 200,
            fichierAudioUrl: 'https://x.com/a.mp3', pochetteUrl: null, dateSortie: null,
            nombreEcoutes: 0, dateAjout: new Date(), statutModeration: 'VALIDE', moderateurId: null, dateModeration: new Date(),
        });
        trackRepository.findById.mockResolvedValue(track);
        trackRepository.save.mockImplementation(async (t) => t);
        const emit = jest.fn();
        const svc = new TracksService(trackRepository, artisteRepository, genreRepository, albumRepository, { emit } as any);

        await svc.update('t1', 'a1', { titre: 'Nouveau titre' });
        expect(emit).toHaveBeenCalledWith('track.unpublished', expect.objectContaining({ titreId: 't1' }));
    });

    it('émet TRACK_UNPUBLISHED_EVENT à la suppression', async () => {
        const track = Track.create({
            id: 't1', albumId: null, artisteId: 'a1', genreId: 'g1', titre: 'T', duree: 200,
            fichierAudioUrl: 'https://x.com/a.mp3', pochetteUrl: null, dateSortie: null,
            nombreEcoutes: 0, dateAjout: new Date(), statutModeration: 'VALIDE', moderateurId: null, dateModeration: new Date(),
        });
        trackRepository.findById.mockResolvedValue(track);
        const emit = jest.fn();
        const svc = new TracksService(trackRepository, artisteRepository, genreRepository, albumRepository, { emit } as any);

        await svc.remove('t1', 'a1');
        expect(emit).toHaveBeenCalledWith('track.unpublished', expect.objectContaining({ titreId: 't1' }));
    });
});