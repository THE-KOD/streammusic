import { apiClient } from '../../../infrastructure/http/api-client'
import { dedupeById } from '../../../shared/utils/dedupe-by-id'
import type { AlbumDetail, AlbumTrack } from '../domain/album-detail.entity'

interface BackendAlbumDto {
    id: string
    artisteId: string
    artisteNom?: string
    titre: string
    pochetteUrl: string | null
    dateSortie: string
}
interface BackendTrackDto {
    id: string
    titre: string
    duree: number
    fichierAudioUrl: string
}

export const albumDetailService = {
    async getAlbumDetail(albumId: string): Promise<{ album: AlbumDetail; tracks: AlbumTrack[] }> {
        const [albumRes, tracksRes] = await Promise.all([
            apiClient.get<BackendAlbumDto>(`/albums/${albumId}`),
            apiClient.get<BackendTrackDto[]>('/tracks', { params: { albumId } }),
        ])

        const totalDuration = tracksRes.data.reduce((sum, t) => sum + t.duree, 0)

        const album: AlbumDetail = {
            id: albumRes.data.id,
            title: albumRes.data.titre,
            artistName: albumRes.data.artisteNom,
            artistId: albumRes.data.artisteId,
            releaseDate: albumRes.data.dateSortie,
            totalDuration,
            coverUrl: albumRes.data.pochetteUrl ?? undefined,
        }

        const tracks: AlbumTrack[] = dedupeById(
            tracksRes.data.map((t) => ({ id: t.id, title: t.titre, duration: t.duree, fileUrl: t.fichierAudioUrl })),
        )

        return { album, tracks }
    },
}