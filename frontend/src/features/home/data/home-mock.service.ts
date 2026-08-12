import type { Track } from '../../../shared/types/track'

const FAKE_DELAY_MS = 900

const MOCK_TRACKS: Track[] = [
    { id: '1', title: 'Midnight Drive', artistName: 'Nova Kline', artistId: 'a1', albumTitle: 'Neon Static', albumId: 'al1', duration: 222, playCount: 15420 },
    { id: '2', title: 'Static Bloom', artistName: 'Nova Kline', artistId: 'a1', albumTitle: 'Neon Static', albumId: 'al1', duration: 198, playCount: 9800 },
    { id: '3', title: 'Glass Horizon', artistName: 'The Reverbs', artistId: 'a2', albumTitle: 'Low Tide', albumId: 'al2', duration: 251, playCount: 5230 },
]

export const homeService = {
    async getPopular(): Promise<Track[]> {
        await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS))
        return MOCK_TRACKS
    },
    async getNewReleases(): Promise<Track[]> {
        await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS + 400))
        return MOCK_TRACKS.slice(1)
    },
    async getRecommendations(): Promise<Track[]> {
        await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS - 200))
        return []
    },
}