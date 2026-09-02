import { apiClient } from '../../../infrastructure/http/api-client'
import type { MyTrack } from '../domain/my-track.entity'

interface BackendTrackDto {
    id: string
    titre: string
    pochetteUrl: string | null
    duree: number
    statutModeration: 'EN_ATTENTE' | 'VALIDE' | 'REJETE'
    nombreEcoutes: number
}

export const myTracksService = {
    async listMine(): Promise<MyTrack[]> {
        const { data } = await apiClient.get<BackendTrackDto[]>('/tracks/mine')
        return data.map((t) => ({ id: t.id, title: t.titre, coverUrl: t.pochetteUrl ?? undefined, duration: t.duree, status: t.statutModeration, playCount: t.nombreEcoutes }))
    },
}