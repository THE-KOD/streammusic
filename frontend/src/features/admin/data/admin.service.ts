import { apiClient } from '../../../infrastructure/http/api-client'
import type { AdminStats, DashboardTrack, AdminUser, ModerationTrack } from '../domain/admin.entity'
import type { Genre } from '../../../shared/types/genre'

interface BackendStatsDto {
    totalUtilisateurs: number
    totalTitres: number
    totalEcoutes: number
    titresPopulaires: { id: string; titre: string; artisteNom: string; nombreEcoutes: number }[]
}
interface BackendAdminUserDto {
    id: string
    pseudo: string
    email: string
    avatarUrl?: string
    statutCompte: 'ACTIF' | 'SUSPENDU'
    dateInscription: string
    role: 'user' | 'artist' | 'admin'
    subscriptionTier: 'GRATUIT' | 'PREMIUM'
}
interface BackendModerationTrackDto {
    id: string
    titre: string
    artisteId: string
    artisteNom?: string
    albumTitre?: string
    genreNom: string
    duree: number
    dateSortie: string | null
    pochetteUrl: string | null
    statutModeration: 'EN_ATTENTE' | 'VALIDE' | 'REJETE'
    dateAjout: string
    nombreEcoutes: number
    fichierAudioUrl: string
}

const FRONT_TO_BACKEND_STATUS: Record<string, string | undefined> = { all: undefined, pending: 'EN_ATTENTE', approved: 'VALIDE', rejected: 'REJETE' }
const BACKEND_TO_FRONT_STATUS: Record<string, 'pending' | 'approved' | 'rejected'> = { EN_ATTENTE: 'pending', VALIDE: 'approved', REJETE: 'rejected' }

export const adminStatsService = {
    async getStats(): Promise<AdminStats> {
        const { data } = await apiClient.get<BackendStatsDto>('/admin/stats')
        return { totalUsers: data.totalUtilisateurs, totalPlays: data.totalEcoutes }
    },
    async getTopTracks(): Promise<DashboardTrack[]> {
        const { data } = await apiClient.get<BackendStatsDto>('/admin/stats')
        return data.titresPopulaires.map((t) => ({ id: t.id, title: t.titre, artistName: t.artisteNom, playCount: t.nombreEcoutes }))
    },
}

export const adminUsersService = {
    async list(): Promise<AdminUser[]> {
        const { data } = await apiClient.get<BackendAdminUserDto[]>('/admin/users')
        return data.map((u) => ({
            id: u.id, pseudo: u.pseudo, email: u.email, avatarUrl: u.avatarUrl,
            isActive: u.statutCompte === 'ACTIF', joinedAt: new Date(u.dateInscription),
            role: u.role, subscriptionTier: u.subscriptionTier === 'PREMIUM' ? 'premium' : 'free',
        }))
    },
    // Le backend expose deux routes distinctes (suspend / reactivate), pas un
    // toggle — le hook appelant connaît déjà l'état courant, transmis ici.
    async toggleSuspend(userId: string, isCurrentlyActive: boolean): Promise<void> {
        const action = isCurrentlyActive ? 'suspend' : 'reactivate'
        await apiClient.patch(`/admin/users/${userId}/${action}`)
    },
    async remove(userId: string): Promise<void> {
        await apiClient.delete(`/admin/users/${userId}`)
    },
}

export const adminModerationService = {
    async list(filterStatus?: string): Promise<ModerationTrack[]> {
        const statut = filterStatus ? FRONT_TO_BACKEND_STATUS[filterStatus] : undefined
        const { data } = await apiClient.get<BackendModerationTrackDto[]>('/admin/tracks', { params: statut ? { statut } : {} })
        return data.map((t) => ({
            id: t.id, title: t.titre, artistName: t.artisteNom ?? 'Artiste inconnu', artistId: t.artisteId,
            albumTitle: t.albumTitre, genreName: t.genreNom, duration: t.duree,
            releaseDate: t.dateSortie ?? undefined, coverUrl: t.pochetteUrl ?? undefined,
            status: BACKEND_TO_FRONT_STATUS[t.statutModeration], submittedAt: new Date(t.dateAjout).toLocaleDateString('fr-FR'),
            playCount: t.nombreEcoutes, fileUrl: t.fichierAudioUrl,
        }))
    },
    async updateStatus(trackId: string, status: 'approved' | 'rejected'): Promise<void> {
        const statut = status === 'approved' ? 'VALIDE' : 'REJETE'
        await apiClient.patch(`/tracks/${trackId}/moderer`, { statut })
    },
}

export const adminGenresService = {
    async list(): Promise<Genre[]> {
        const { data } = await apiClient.get<{ id: string; nom: string }[]>('/genres')
        return data.map((g) => ({ id: g.id, name: g.nom }))
    },
    async create(name: string): Promise<void> {
        await apiClient.post('/genres', { nom: name })
    },
    async update(id: string, name: string): Promise<void> {
        await apiClient.patch(`/genres/${id}`, { nom: name })
    },
    async remove(id: string): Promise<void> {
        await apiClient.delete(`/genres/${id}`)
    },
}