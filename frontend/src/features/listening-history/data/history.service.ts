import { apiClient } from '../../../infrastructure/http/api-client'
import { mapTrackResponse, type BackendTrackDto } from '../../../shared/utils/map-track-response'
import { dedupeById } from '../../../shared/utils/dedupe-by-id'
import type { Track } from '../../../shared/types/track'

interface BackendHistoryEntryDto {
    id: string
    dateEcoute: string
    dureeEcoutee: number
    track: BackendTrackDto
}

export interface HistoryEntry {
    id: string
    track: Track
    listenedAt: Date
}

export const historyService = {
    async listMine(): Promise<HistoryEntry[]> {
        const { data } = await apiClient.get<BackendHistoryEntryDto[]>('/listening-history/mine')
        return dedupeById(data.map((e) => ({ id: e.id, track: mapTrackResponse(e.track), listenedAt: new Date(e.dateEcoute) })))
    },

    // Best-effort : jamais d'exception remontée à l'appelant — voir AudioPlayer,
    // qui ne doit jamais interrompre une lecture à cause d'un échec réseau ici.
    async logListen(titreId: string, dureeEcoutee: number): Promise<void> {
        if (dureeEcoutee <= 0) return
        try {
            await apiClient.post('/listening-history', { titreId, dureeEcoutee: Math.floor(dureeEcoutee) })
        } catch {
            // silencieux, volontairement
        }
    },
}