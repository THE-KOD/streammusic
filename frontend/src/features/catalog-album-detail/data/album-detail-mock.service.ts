import type { AlbumDetail, AlbumTrack } from '../domain/album-detail.entity'
import { AlbumNotFoundError } from '../domain/errors'

const FAKE_DELAY_MS = 800

const MOCK_ALBUM: AlbumDetail = {
    id: 'album-1',
    title: 'Neon Static',
    artistName: 'Nova Kline',
    artistId: 'a1',
    releaseDate: '2026-03-12',
    totalDuration: 1288,
}

const MOCK_TRACKS: AlbumTrack[] = [
    { id: 't1', title: 'Track 01', duration: 222 },
    { id: 't2', title: 'Track 02', duration: 255 },
    { id: 't3', title: 'Track 03', duration: 238 },
    { id: 't4', title: 'Track 04', duration: 301 },
    { id: 't5', title: 'Track 05', duration: 272 },
]

export const albumDetailService = {
    async getAlbumDetail(albumId: string): Promise<{ album: AlbumDetail; tracks: AlbumTrack[] }> {
        await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS))
        if (albumId !== 'album-1') throw new AlbumNotFoundError()
        return { album: MOCK_ALBUM, tracks: MOCK_TRACKS }
    },
}