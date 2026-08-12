import type { Track } from '../../../shared/types/track'
import type { Artist } from '../../../shared/types/artist'
import type { Album } from '../../../shared/types/album'

export interface SearchFilters {
    genre?: string
    minDuration?: number
    maxDuration?: number
}

export interface SearchResults {
    artists: Artist[]
    albums: Album[]
    tracks: Track[]
}