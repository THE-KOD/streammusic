import { CATALOG_TRACKS_MOCK } from '../../../shared/mocks/catalog-tracks.mock'
import { CATALOG_GENRES_MOCK } from '../../../shared/mocks/catalog-genres.mock'
import type { AdminStats, DashboardTrack, AdminUser, ModerationTrack } from '../domain/admin.entity'
import type { Genre } from '../../../shared/types/genre'
import { GenreInUseError } from '../domain/errors'

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export const adminStatsService = {
    async getStats(): Promise<AdminStats> {
        await delay()
        return { totalUsers: 12458, totalPlays: 1245890 }
    },
    // Titres les plus écoutés dérivés du vrai catalogue, pas d'une liste fictive séparée
    async getTopTracks(): Promise<DashboardTrack[]> {
        await delay(600)
        return [...CATALOG_TRACKS_MOCK]
            .sort((a, b) => (b.playCount ?? 0) - (a.playCount ?? 0))
            .slice(0, 4)
            .map((t) => ({ id: t.id, title: t.title, artistName: t.artistName, artistId: t.artistId, duration: t.duration, playCount: t.playCount ?? 0 }))
    },
}

let usersDb: AdminUser[] = [
    { id: 'u1', pseudo: 'Night', email: 'night@example.com', joinedAt: new Date('2026-08-13'), isActive: true, authMethod: 'password', genres: ['Afrobeat', 'Hip-Hop'], role: 'artist', subscriptionTier: 'premium' },
    { id: 'u2', pseudo: 'User02', email: 'user2@example.com', joinedAt: new Date('2026-08-12'), isActive: false, authMethod: 'password', genres: [], role: 'user', subscriptionTier: 'free' },
    { id: 'u3', pseudo: 'User03', email: 'user3@example.com', joinedAt: new Date('2026-08-10'), isActive: true, authMethod: 'oauth', genres: ['Pop', 'Rock'], role: 'admin', subscriptionTier: 'free' },
]

export const adminUsersService = {
    async list(): Promise<AdminUser[]> { await delay(); return usersDb },
    async get(id: string): Promise<AdminUser | undefined> { await delay(); return usersDb.find((u) => u.id === id) },
    async toggleSuspend(id: string): Promise<void> {
        await delay()
        usersDb = usersDb.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    },
    async remove(id: string): Promise<void> {
        await delay()
        usersDb = usersDb.filter((u) => u.id !== id)
    },
}

// File de modération : contenu pas encore publié, distinct volontairement du catalogue déjà en ligne
let moderationTracksDb: ModerationTrack[] = [
    { id: 't1', title: 'Neon Afterglow', artistName: 'Nova Kline', artistId: 'a1', albumTitle: 'Neon Static', genreName: 'Pop', duration: 222, releaseDate: '2026-08-20', status: 'pending', submittedAt: '2026-08-13', fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
    { id: 't2', title: 'Backroad Echo', artistName: 'The Reverbs', artistId: 'a2', albumTitle: 'Low Tide', genreName: 'Hip-Hop', duration: 255, releaseDate: '2026-08-18', status: 'approved', submittedAt: '2026-08-12', playCount: 340, fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
    { id: 't3', title: 'Dust and Static', artistName: 'Nova Kline', artistId: 'a1', genreName: 'Jazz', duration: 178, releaseDate: '2026-08-15', status: 'rejected', submittedAt: '2026-08-11', fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
]

export const adminModerationService = {
    async list(filterStatus?: string): Promise<ModerationTrack[]> {
        await delay()
        return filterStatus && filterStatus !== 'all' ? moderationTracksDb.filter((t) => t.status === filterStatus) : moderationTracksDb
    },
    async get(id: string): Promise<ModerationTrack | undefined> { await delay(); return moderationTracksDb.find((t) => t.id === id) },
    async updateStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
        await delay()
        moderationTracksDb = moderationTracksDb.map((t) => (t.id === id ? { ...t, status } : t))
    },
}

// Genres : opère sur le catalogue PARTAGÉ — un changement ici se répercute aussi sur le formulaire Upload
export const adminGenresService = {
    async list(): Promise<Genre[]> { await delay(400); return CATALOG_GENRES_MOCK },
    async create(name: string): Promise<void> {
        await delay()
        CATALOG_GENRES_MOCK.push({ id: `g${Date.now()}`, name })
    },
    async update(id: string, name: string): Promise<void> {
        await delay()
        const genre = CATALOG_GENRES_MOCK.find((g) => g.id === id)
        if (genre) genre.name = name
    },
    // Miroir de la contrainte ON DELETE RESTRICT du schéma SQL (titre.genre_id)
    async remove(id: string): Promise<void> {
        await delay()
        const genre = CATALOG_GENRES_MOCK.find((g) => g.id === id)
        const isInUse = moderationTracksDb.some((t) => t.genreName === genre?.name)
        if (isInUse) throw new GenreInUseError()
        const index = CATALOG_GENRES_MOCK.findIndex((g) => g.id === id)
        if (index !== -1) CATALOG_GENRES_MOCK.splice(index, 1)
    },
}