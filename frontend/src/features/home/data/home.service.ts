import { apiClient } from '../../../infrastructure/http/api-client'
import { mapTrackResponse, type BackendTrackDto } from '../../../shared/utils/map-track-response'
import type { Track } from '../../../shared/types/track'

const NOMBRE_TITRES_PAR_SECTION = 10

export const homeService = {
    async getPopular(): Promise<Track[]> {
        // Le backend ne trie que par date d'ajout — tri par popularité fait ici,
        // acceptable tant que le catalogue reste petit (même compromis déjà
        // assumé côté backend pour le fallback de suggestions).
        const { data } = await apiClient.get<BackendTrackDto[]>('/tracks')
        return [...data].sort((a, b) => b.nombreEcoutes - a.nombreEcoutes).slice(0, NOMBRE_TITRES_PAR_SECTION).map(mapTrackResponse)
    },

    async getNewReleases(): Promise<Track[]> {
        // Déjà trié par date_ajout DESC côté backend.
        const { data } = await apiClient.get<BackendTrackDto[]>('/tracks')
        return data.slice(0, NOMBRE_TITRES_PAR_SECTION).map(mapTrackResponse)
    },

    async getRecommendations(): Promise<Track[]> {
        const { data: existantes } = await apiClient.get<BackendTrackDto[]>('/suggestions/mine')
        if (existantes.length > 0) return existantes.map(mapTrackResponse)
        // Première visite : aucune suggestion encore générée — on en déclenche
        // une plutôt que de renvoyer une liste vide en permanence.
        const { data: generees } = await apiClient.post<BackendTrackDto[]>('/suggestions/mine/generate')
        return generees.map(mapTrackResponse)
    },
}