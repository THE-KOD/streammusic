import { FavoritesService } from './favorites.service';
import { Track } from '../../catalog-tracks';
import { TrackNotFoundError } from '../../catalog-tracks';
import type { FavorisRepository } from '../domain/favoris.repository';
import type { TrackRepository } from '../../catalog-tracks';
import type { AlbumRepository } from '../../catalog-albums';

function buildTrack(id: string) {
    return Track.create({
        id, albumId: null, artisteId: 'a1', genreId: 'g1', titre: 'T', duree: 200,
        fichierAudioUrl: 'https://x.com/a.mp3', pochetteUrl: null, dateSortie: null,
        nombreEcoutes: 0, dateAjout: new Date(), statutModeration: 'VALIDE',
        moderateurId: null, dateModeration: null,
    });
}

describe('FavoritesService', () => {
    let favorisRepository: jest.Mocked<FavorisRepository>;
    let trackRepository: jest.Mocked<TrackRepository>;
    let albumRepository: jest.Mocked<AlbumRepository>;
    let service: FavoritesService;

    beforeEach(() => {
        favorisRepository = {
            isTitreFavori: jest.fn(), addTitreFavori: jest.fn(), removeTitreFavori: jest.fn(), listTitreIdsFavoris: jest.fn(),
            isAlbumFavori: jest.fn(), addAlbumFavori: jest.fn(), removeAlbumFavori: jest.fn(), listAlbumIdsFavoris: jest.fn(),
        };
        trackRepository = { findById: jest.fn(), findAllValide: jest.fn(), findAllByArtiste: jest.fn(), save: jest.fn(), delete: jest.fn() };
        albumRepository = { findById: jest.fn(), existsById: jest.fn(), findAll: jest.fn(), findByArtisteId: jest.fn(), save: jest.fn(), delete: jest.fn() };
        service = new FavoritesService(favorisRepository, trackRepository, albumRepository);
    });

    it("refuse d'ajouter un titre inexistant en favori", async () => {
        trackRepository.findById.mockResolvedValue(null);
        await expect(service.addTrack('u1', 'inconnu')).rejects.toThrow(TrackNotFoundError);
    });

    it('ajoute un titre existant sans erreur', async () => {
        trackRepository.findById.mockResolvedValue(buildTrack('t1'));
        await service.addTrack('u1', 't1');
        expect(favorisRepository.addTitreFavori).toHaveBeenCalledWith('u1', 't1');
    });

    it('listTracks() ignore silencieusement un id favori dont le titre a été supprimé depuis', async () => {
        favorisRepository.listTitreIdsFavoris.mockResolvedValue(['t1', 't2-supprime']);
        trackRepository.findById.mockImplementation(async (id) => (id === 't1' ? buildTrack('t1') : null));

        const tracks = await service.listTracks('u1');
        expect(tracks).toHaveLength(1);
        expect(tracks[0].id).toBe('t1');
    });

    it('isTrackLiked() délègue au repository', async () => {
        favorisRepository.isTitreFavori.mockResolvedValue(true);
        expect(await service.isTrackLiked('u1', 't1')).toBe(true);
    });

    it('isAlbumSaved() délègue au repository', async () => {
        favorisRepository.isAlbumFavori.mockResolvedValue(false);
        expect(await service.isAlbumSaved('u1', 'al1')).toBe(false);
    });
});