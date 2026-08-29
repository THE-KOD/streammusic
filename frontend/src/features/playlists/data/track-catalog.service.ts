import { apiClient } from '../../../infrastructure/http/api-client'
import { mapTrackResponse, type BackendTrackDto } from '../../../shared/utils/map-track-response'
import { dedupeById } from '../../../shared/utils/dedupe-by-id'
import type { Track } from '../../../shared/types/track'

export const trackCatalogService = {
    async listAll(): Promise<Track[]> {
        const { data } = await apiClient.get<BackendTrackDto[]>('/tracks')
        return dedupeById(data.map(mapTrackResponse))
    },
}