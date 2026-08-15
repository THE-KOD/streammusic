import { CATALOG_TRACKS_MOCK } from '../../../shared/mocks/catalog-tracks.mock'
import { CATALOG_ALBUMS_MOCK } from '../../../shared/mocks/catalog-albums.mock'
import type { Track } from '../../../shared/types/track'
import type { Album } from '../../../shared/types/album'

const FAKE_DELAY_MS = 500
const delay = () => new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS))

let likedTrackIds = new Set<string>(['t1', 't3'])
let savedAlbumIds = new Set<string>(['album-1'])

export const favoritesService = {
    async listLikedTracks(): Promise<Track[]> {
        await delay()
        return CATALOG_TRACKS_MOCK.filter((t) => likedTrackIds.has(t.id))
    },
    async isTrackLiked(trackId: string): Promise<boolean> {
        return likedTrackIds.has(trackId)
    },
    async toggleTrackLike(trackId: string): Promise<boolean> {
        await delay()
        if (likedTrackIds.has(trackId)) { likedTrackIds.delete(trackId); return false }
        likedTrackIds.add(trackId)
        return true
    },

    async listSavedAlbums(): Promise<Album[]> {
        await delay()
        return CATALOG_ALBUMS_MOCK.filter((a) => savedAlbumIds.has(a.id))
    },
    async isAlbumSaved(albumId: string): Promise<boolean> {
        return savedAlbumIds.has(albumId)
    },
    async toggleAlbumSave(albumId: string): Promise<boolean> {
        await delay()
        if (savedAlbumIds.has(albumId)) { savedAlbumIds.delete(albumId); return false }
        savedAlbumIds.add(albumId)
        return true
    },
}