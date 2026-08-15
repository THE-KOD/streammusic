import { CATALOG_TRACKS_MOCK } from '../../../shared/mocks/catalog-tracks.mock'
import { CATALOG_ALBUMS_MOCK } from '../../../shared/mocks/catalog-albums.mock'
import type { AlbumDetail, AlbumTrack } from '../domain/album-detail.entity'
import { AlbumNotFoundError } from '../domain/errors'

const FAKE_DELAY_MS = 800

export const albumDetailService = {
    async getAlbumDetail(albumId: string): Promise<{ album: AlbumDetail; tracks: AlbumTrack[] }> {
        await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS))
        const albumMeta = CATALOG_ALBUMS_MOCK.find((a) => a.id === albumId)
        if (!albumMeta) throw new AlbumNotFoundError()
        const tracks: AlbumTrack[] = CATALOG_TRACKS_MOCK
            .filter((t) => t.albumId === albumId)
            .map((t) => ({ id: t.id, title: t.title, duration: t.duration, fileUrl: t.fileUrl }))
        const totalDuration = tracks.reduce((sum, t) => sum + t.duration, 0)
        return { album: { ...albumMeta, totalDuration }, tracks }
    },
}