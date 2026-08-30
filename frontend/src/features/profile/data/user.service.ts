import { apiClient } from '../../../infrastructure/http/api-client'

interface BackendUserDto {
    id: string
    pseudo: string
    email: string
    photoProfilUrl?: string
    statutCompte: 'ACTIF' | 'SUSPENDU'
    authMethod: 'password' | 'oauth'
    dateInscription: string
}
interface GenreDto {
    id: string
    nom: string
}

export const userService = {
    async getMe(): Promise<BackendUserDto> {
        const { data } = await apiClient.get<BackendUserDto>('/users/me')
        return data
    },
    async updateMe(updates: { pseudo?: string; photoProfilUrl?: string }): Promise<BackendUserDto> {
        const { data } = await apiClient.patch<BackendUserDto>('/users/me', updates)
        return data
    },
    async listAllGenres(): Promise<GenreDto[]> {
        const { data } = await apiClient.get<GenreDto[]>('/genres')
        return data
    },
    async getGenrePreferenceIds(): Promise<string[]> {
        const { data } = await apiClient.get<{ genreIds: string[] }>('/users/me/preferences')
        return data.genreIds
    },
    async updateGenrePreferenceIds(genreIds: string[]): Promise<void> {
        await apiClient.patch('/users/me/preferences', { genreIds })
    },
}