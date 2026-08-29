import { apiClient } from '../../../infrastructure/http/api-client'
import { mapTrackResponse, type BackendTrackDto } from '../../../shared/utils/map-track-response'
import { dedupeById } from '../../../shared/utils/dedupe-by-id'
import type { Playlist, PlaylistTrack } from '../domain/playlist.entity'

interface BackendPlaylistDto {
    id: string
    proprietaireId: string
    nom: string
    visibilite: 'PUBLIQUE' | 'PRIVEE'
    dateCreation: string
    trackCount: number
}
interface BackendPlaylistTrackDto extends BackendTrackDto {
    ordre: number
}

function mapPlaylist(dto: BackendPlaylistDto): Playlist {
    return { id: dto.id, name: dto.nom, isPublic: dto.visibilite === 'PUBLIQUE', trackCount: dto.trackCount }
}
function mapPlaylistTrack(dto: BackendPlaylistTrackDto): PlaylistTrack {
    return { id: dto.id, position: dto.ordre, track: mapTrackResponse(dto) }
}

export const playlistsService = {
    async list(): Promise<Playlist[]> {
        const { data } = await apiClient.get<BackendPlaylistDto[]>('/playlists/mine')
        return dedupeById(data.map(mapPlaylist))
    },
    async get(playlistId: string): Promise<{ playlist: Playlist; tracks: PlaylistTrack[] }> {
        const [playlistRes, tracksRes] = await Promise.all([
            apiClient.get<BackendPlaylistDto>(`/playlists/${playlistId}`),
            apiClient.get<BackendPlaylistTrackDto[]>(`/playlists/${playlistId}/tracks`),
        ])
        return { playlist: mapPlaylist(playlistRes.data), tracks: dedupeById(tracksRes.data.map(mapPlaylistTrack)) }
    },
    async create(name: string): Promise<Playlist> {
        const { data } = await apiClient.post<BackendPlaylistDto>('/playlists', { nom: name })
        return mapPlaylist(data)
    },
    async rename(id: string, name: string): Promise<void> {
        await apiClient.patch(`/playlists/${id}`, { nom: name })
    },
    async updateVisibility(id: string, isPublic: boolean): Promise<void> {
        await apiClient.patch(`/playlists/${id}`, { visibilite: isPublic ? 'PUBLIQUE' : 'PRIVEE' })
    },
    async remove(id: string): Promise<void> {
        await apiClient.delete(`/playlists/${id}`)
    },
    async addTrack(playlistId: string, trackId: string): Promise<void> {
        await apiClient.post(`/playlists/${playlistId}/tracks/${trackId}`)
    },
    async removeTrack(playlistId: string, trackId: string): Promise<void> {
        await apiClient.delete(`/playlists/${playlistId}/tracks/${trackId}`)
    },
    async reorderTrack(playlistId: string, trackId: string, versPosition: number): Promise<void> {
        await apiClient.patch(`/playlists/${playlistId}/tracks/${trackId}/position`, { versPosition })
    },
}