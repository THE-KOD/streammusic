import { apiClient } from '../../../infrastructure/http/api-client'
import { mapTrackResponse, type BackendTrackDto } from '../../../shared/utils/map-track-response'
import { dedupeById } from '../../../shared/utils/dedupe-by-id'
import type { Track } from '../../../shared/types/track'
import type { Album } from '../../../shared/types/album'

interface BackendAlbumDto {
    id: string
    titre: string
    artisteId: string
    artisteNom?: string
    pochetteUrl: string | null
    dateSortie: string
}

export const favoritesService = {
    async listLikedTracks(): Promise<Track[]> {
        const { data } = await apiClient.get<BackendTrackDto[]>('/favorites/tracks')
        return dedupeById(data.map(mapTrackResponse))
    },
    async isTrackLiked(trackId: string): Promise<boolean> {
        const { data } = await apiClient.get<{ isFavorite: boolean }>(`/favorites/tracks/${trackId}/status`)
        return data.isFavorite
    },
    // Signature identique au mock : un seul argument. La détermination
    // POST vs DELETE se fait ici, en interrogeant d'abord le statut actuel —
    // évite de devoir faire remonter l'état local jusqu'aux appelants.
    async toggleTrackLike(trackId: string): Promise<boolean> {
        const isLiked = await favoritesService.isTrackLiked(trackId)
        if (isLiked) { await apiClient.delete(`/favorites/tracks/${trackId}`); return false }
        await apiClient.post(`/favorites/tracks/${trackId}`)
        return true
    },

    async listSavedAlbums(): Promise<Album[]> {
        const { data } = await apiClient.get<BackendAlbumDto[]>('/favorites/albums')
        return dedupeById(data.map((a) => ({ id: a.id, title: a.titre, artistName: a.artisteNom, artistId: a.artisteId, releaseDate: a.dateSortie, coverUrl: a.pochetteUrl ?? undefined })))
    },
    async isAlbumSaved(albumId: string): Promise<boolean> {
        const { data } = await apiClient.get<{ isFavorite: boolean }>(`/favorites/albums/${albumId}/status`)
        return data.isFavorite
    },
    async toggleAlbumSave(albumId: string): Promise<boolean> {
        const isSaved = await favoritesService.isAlbumSaved(albumId)
        if (isSaved) { await apiClient.delete(`/favorites/albums/${albumId}`); return false }
        await apiClient.post(`/favorites/albums/${albumId}`)
        return true
    },
}