import type { SearchFilters, SearchResults } from '../domain/search.entity'

const FAKE_DELAY_MS = 900

const MOCK_ARTISTS = [{ id: 'a1', name: 'Nova Kline' }, { id: 'a2', name: 'The Reverbs' }]
const MOCK_ALBUMS = [{ id: 'al1', title: 'Neon Static', artistName: 'Nova Kline', artistId: 'a1', releaseDate: '2025-03-14' }]
const MOCK_TRACKS = [
    { id: 't1', title: 'Midnight Drive', artistName: 'Nova Kline', artistId: 'a1', albumTitle: 'Neon Static', albumId: 'al1', duration: 222 },
    { id: 't2', title: 'Glass Horizon', artistName: 'The Reverbs', artistId: 'a2', albumTitle: 'Low Tide', albumId: 'al2', duration: 251 },
]

// _filters non utilisé pour l'instant (mock) — signature prête pour la Phase 4, quand le backend filtrera réellement
export const searchService = {
    async search(query: string, _filters: SearchFilters): Promise<SearchResults> {
        await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS))
        if (!query.trim() || query.toLowerCase().includes('rien')) return { artists: [], albums: [], tracks: [] }
        return { artists: MOCK_ARTISTS, albums: MOCK_ALBUMS, tracks: MOCK_TRACKS }
    },
}