import { apiClient } from '../../../infrastructure/http/api-client'
import type { Album } from '../../../shared/types/album'
import type { Genre } from '../../../shared/types/genre'
import { uploadFile } from '../../../infrastructure/http/file-upload'

interface BackendAlbumDto {
    id: string
    titre: string
    artisteId: string
    artisteNom?: string
    pochetteUrl: string | null
    dateSortie: string
}
interface BackendGenreDto {
    id: string
    nom: string
}
interface BackendArtistDto {
    id: string
    pseudo: string
}

export const uploadCatalogService = {
    async listAlbumsByArtist(artistId: string): Promise<Album[]> {
        const { data } = await apiClient.get<BackendAlbumDto[]>('/albums', { params: { artisteId: artistId } })
        return data.map((a) => ({ id: a.id, title: a.titre, artistName: a.artisteNom, artistId: a.artisteId, releaseDate: a.dateSortie, coverUrl: a.pochetteUrl ?? undefined }))
    },
    async listGenres(): Promise<Genre[]> {
        const { data } = await apiClient.get<BackendGenreDto[]>('/genres')
        return data.map((g) => ({ id: g.id, name: g.nom }))
    },
    // null si le compte connecté n'a pas encore de profil artiste (404 backend)
    async getMyArtistProfile(userId: string): Promise<{ id: string; pseudo: string } | null> {
        try {
            const { data } = await apiClient.get<BackendArtistDto>(`/artists/${userId}`)
            return { id: data.id, pseudo: data.pseudo }
        } catch {
            return null
        }
    },
    async becomeArtist(): Promise<void> {
        await apiClient.post('/artists/me', {})
    },

    async createAlbum(title: string, releaseDate: string, coverFile: File | null): Promise<Album> {
        const pochetteUrl = coverFile ? await uploadFile(coverFile, 'image') : undefined
        const { data } = await apiClient.post<BackendAlbumDto>('/albums', { titre: title, dateSortie: releaseDate, pochetteUrl })
        return { id: data.id, title: data.titre, artistName: data.artisteNom, artistId: data.artisteId, releaseDate: data.dateSortie, coverUrl: data.pochetteUrl ?? undefined }
    },
}