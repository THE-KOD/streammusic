import type { Track } from '../../../shared/types/track'
import type { Album } from '../../../shared/types/album'

export interface SearchFilters {
    genreId?: string
    dureeMin?: number
    dureeMax?: number
}

export interface SearchArtistResult {
    id: string
    name: string
    imageUrl?: string
}

export interface SearchResults {
    tracks: Track[]
    artists: SearchArtistResult[]
    albums: Album[]
}