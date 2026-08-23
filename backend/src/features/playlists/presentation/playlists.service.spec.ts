import { PlaylistsService } from './playlists.service';
import { Playlist } from '../domain/playlist.entity';
import { Track } from '../../catalog-tracks';
import { PlaylistNotFoundError, TitreDejaDansPlaylistError } from '../domain/errors';
import { ForbiddenError } from '../../../core/errors';
import type { PlaylistRepository } from '../domain/playlist.repository';
import type { PlaylistTrackRepository } from '../domain/playlist-track.repository';
import type { TrackRepository } from '../../catalog-tracks';

function buildPlaylist(overrides: Partial<Parameters<typeof Playlist.create>[0]> = {}) {
    return Playlist.create({ id: 'p1', proprietaireId: 'u1', nom: 'Test', visibilite: 'PRIVEE', dateCreation: new Date(), ...overrides });
}
function buildTrack(id: string) {
    return Track.create({
        id, albumId: null, artisteId: 'a1', genreId: 'g1', titre: 'T', duree: 200,
        fichierAudioUrl: 'https://x.com/a.mp3', pochetteUrl: null, dateSortie: null,
        nombreEcoutes: 0, dateAjout: new Date(), statutModeration: 'VALIDE', moderateurId: null, dateModeration: null,
    });
}

describe('PlaylistsService', () => {
    let playlistRepository: jest.Mocked<PlaylistRepository>;
    let playlistTrackRepository: jest.Mocked<PlaylistTrackRepository>;
    let trackRepository: jest.Mocked<TrackRepository>;
    let service: PlaylistsService;

    beforeEach(() => {
        playlistRepository = { findById: jest.fn(), findByProprietaire: jest.fn(), save: jest.fn(), delete: jest.fn() };
        playlistTrackRepository = { list: jest.fn(), count: jest.fn(), isPresent: jest.fn(), getMaxOrdre: jest.fn(), add: jest.fn(), remove: jest.fn(), reorderAll: jest.fn() };
        trackRepository = { findById: jest.fn(), findAllValide: jest.fn(), findAllByArtiste: jest.fn(), save: jest.fn(), delete: jest.fn() };
        service = new PlaylistsService(playlistRepository, playlistTrackRepository, trackRepository);
    });

    it("masque en 404 une playlist privée consultée par quelqu'un d'autre que le propriétaire", async () => {
        playlistRepository.findById.mockResolvedValue(buildPlaylist({ visibilite: 'PRIVEE' }));
        await expect(service.getById('p1', 'u2')).rejects.toThrow(PlaylistNotFoundError);
    });

    it('autorise la consultation d\'une playlist publique par un autre utilisateur', async () => {
        playlistRepository.findById.mockResolvedValue(buildPlaylist({ visibilite: 'PUBLIQUE' }));
        playlistTrackRepository.count.mockResolvedValue(0);
        const result = await service.getById('p1', 'u2');
        expect(result.playlist.id).toBe('p1');
    });

    it("refuse d'ajouter un titre à la playlist d'un autre utilisateur", async () => {
        playlistRepository.findById.mockResolvedValue(buildPlaylist({ visibilite: 'PUBLIQUE' }));
        playlistTrackRepository.count.mockResolvedValue(0);
        await expect(service.addTrack('p1', 'u2', 't1')).rejects.toThrow(ForbiddenError);
    });

    it('refuse un titre déjà présent dans la playlist', async () => {
        playlistRepository.findById.mockResolvedValue(buildPlaylist());
        playlistTrackRepository.count.mockResolvedValue(1);
        trackRepository.findById.mockResolvedValue(buildTrack('t1'));
        playlistTrackRepository.isPresent.mockResolvedValue(true);

        await expect(service.addTrack('p1', 'u1', 't1')).rejects.toThrow(TitreDejaDansPlaylistError);
    });

    it('ajoute un titre à la position maxOrdre + 1', async () => {
        playlistRepository.findById.mockResolvedValue(buildPlaylist());
        playlistTrackRepository.count.mockResolvedValue(2);
        trackRepository.findById.mockResolvedValue(buildTrack('t3'));
        playlistTrackRepository.isPresent.mockResolvedValue(false);
        playlistTrackRepository.getMaxOrdre.mockResolvedValue(2);

        await service.addTrack('p1', 'u1', 't3');
        expect(playlistTrackRepository.add).toHaveBeenCalledWith('p1', 't3', 3);
    });
});