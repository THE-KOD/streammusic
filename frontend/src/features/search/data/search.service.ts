import { apiClient } from '../../../infrastructure/http/api-client'
import type { SearchFilters, SearchResults } from '../domain/search.types'
import type { Track } from '../../../shared/types/track'

interface BackendSearchTrackDto {
    id: string
    titre: string
    artisteId: string
    artisteNom: string
    albumId?: string | null
    albumTitre?: string | null
    duree: number
    pochetteUrl: string | null
    fichierAudioUrl: string
}
interface BackendSearchArtistDto {
    id: string
    pseudo: string
    photoArtisteUrl: string | null
}
interface BackendSearchAlbumDto {
    id: string
    titre: string
    artisteId: string
    artisteNom: string
    pochetteUrl: string | null
    dateSortie: string
}
interface BackendSearchResponse {
    tracks: BackendSearchTrackDto[]
    artists: BackendSearchArtistDto[]
    albums: BackendSearchAlbumDto[]
}

// Mapper local, distinct de shared/utils/map-track-response.ts : la forme
// renvoyée par /search est plus légère que TrackResponseDto (pas de
// statutModeration/dateAjout, inutiles ici puisque seuls des titres validés
// peuvent être indexés). Un seul site d'utilisation pour l'instant — pas
// encore extrait vers shared/ (règle du "2e usage" du contrat).
function mapSearchTrack(dto: BackendSearchTrackDto): Track {
    return {
        id: dto.id,
        title: dto.titre,
        artistName: dto.artisteNom,
        artistId: dto.artisteId,
        albumTitle: dto.albumTitre ?? undefined,
        albumId: dto.albumId ?? undefined,
        duration: dto.duree,
        coverUrl: dto.pochetteUrl ?? undefined,
        fileUrl: dto.fichierAudioUrl,
    }
}

export const searchService = {
    async search(query: string, filters: SearchFilters): Promise<SearchResults> {
        const { data } = await apiClient.get<BackendSearchResponse>('/search', {
            params: { q: query, genreId: filters.genreId, dureeMin: filters.dureeMin, dureeMax: filters.dureeMax },
        })
        return {
            tracks: data.tracks.map(mapSearchTrack),
            artists: data.artists.map((a) => ({ id: a.id, name: a.pseudo, imageUrl: a.photoArtisteUrl ?? undefined })),
            albums: data.albums.map((a) => ({
                id: a.id, title: a.titre, artistName: a.artisteNom, artistId: a.artisteId,
                releaseDate: a.dateSortie, coverUrl: a.pochetteUrl ?? undefined,
            })),
        }
    },
}