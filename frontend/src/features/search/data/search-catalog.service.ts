import { apiClient } from '../../../infrastructure/http/api-client'

export interface GenreOption {
    id: string
    nom: string
}

export const searchCatalogService = {
    async listGenres(): Promise<GenreOption[]> {
        const { data } = await apiClient.get<GenreOption[]>('/genres')
        return data
    },
}