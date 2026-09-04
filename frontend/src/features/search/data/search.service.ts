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

    // Aperçu affiché avant toute recherche — réutilise directement les
    // endpoints du catalogue (pas /search) puisqu'aucun terme n'est saisi.
    async browse(): Promise<SearchResults> {
        const PREVIEW_LIMIT = 8
        const [tracksRes, artistsRes, albumsRes] = await Promise.all([
            apiClient.get<BackendTrackDto[]>('/tracks'),
            apiClient.get<BackendArtistResult[]>('/artists'),
            apiClient.get<BackendAlbumResult[]>('/albums'),
        ])
        return {
            tracks: tracksRes.data.slice(0, PREVIEW_LIMIT).map(mapTrackResponse),
            artists: artistsRes.data.slice(0, PREVIEW_LIMIT).map((a) => ({ id: a.id, name: a.pseudo, imageUrl: a.photoProfilUrl })),
            albums: albumsRes.data.slice(0, PREVIEW_LIMIT).map((a) => ({ id: a.id, title: a.titre, artistName: a.artisteNom, artistId: a.artisteId, releaseDate: a.dateSortie, coverUrl: a.pochetteUrl ?? undefined })),
        }
    },
}