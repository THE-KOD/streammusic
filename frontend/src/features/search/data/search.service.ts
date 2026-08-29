import { apiClient } from '../../../infrastructure/http/api-client'
import { mapTrackResponse, type BackendTrackDto } from '../../../shared/utils/map-track-response'
import type { Track } from '../../../shared/types/track'
import type { Artist } from '../../../shared/types/artist'
import type { Album } from '../../../shared/types/album'
import type { SearchFilters } from '../domain/search.entity'

interface BackendArtistResult {
    id: string
    pseudo: string
    photoProfilUrl?: string
}
interface BackendAlbumResult {
    id: string
    titre: string
    artisteId: string
    artisteNom?: string
    pochetteUrl: string | null
    dateSortie: string
}
interface BackendSearchResponse {
    tracks: BackendTrackDto[]
    artists: BackendArtistResult[]
    albums: BackendAlbumResult[]
}

export interface SearchResults {
    tracks: Track[]
    artists: Artist[]
    albums: Album[]
}

export const searchService = {
    async search(query: string, filters: SearchFilters): Promise<SearchResults> {
        const { data } = await apiClient.get<BackendSearchResponse>('/search', {
            params: { q: query, genreId: filters.genreId, dureeMin: filters.minDuration, dureeMax: filters.maxDuration },
        })
        return {
            tracks: data.tracks.map(mapTrackResponse),
            artists: data.artists.map((a) => ({ id: a.id, name: a.pseudo, imageUrl: a.photoProfilUrl })),
            albums: data.albums.map((a) => ({ id: a.id, title: a.titre, artistName: a.artisteNom, artistId: a.artisteId, releaseDate: a.dateSortie, coverUrl: a.pochetteUrl ?? undefined })),
        }
    },
}