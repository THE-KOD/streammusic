import { useState, useEffect } from 'react'
import type { AdminStats, DashboardTrack, AdminUser, ModerationTrack, Genre } from '../../../../shared/types/admin'

const mockStats: AdminStats = {
    totalUsers: 12458,
    totalPlays: 1245890,
}

const mockTopTracks: DashboardTrack[] = [
    { id: '1', title: 'Midnight Drive', artistName: 'Night', artistId: 'a1', duration: 222, playCount: 125430 },
    { id: '2', title: 'Sunset Waves', artistName: 'Wave', artistId: 'a2', duration: 180, playCount: 98400 },
    { id: '3', title: 'City Lights', artistName: 'Night', artistId: 'a1', duration: 210, playCount: 76300 },
    { id: '4', title: 'Ocean Breeze', artistName: 'Breeze', artistId: 'a3', duration: 195, playCount: 54200 },
]

const mockUsers: AdminUser[] = [
    { id: 'u1', pseudo: 'Night', email: 'night@example.com', isActive: true, subscriptionTier: 'premium', role: 'artist', joinedAt: '2026-08-13', subscription: { tier: 'premium', startDate: '2026-08-01', endDate: '2026-09-01' }, genres: ['Afrobeat', 'Hip-Hop'] },
    { id: 'u2', pseudo: 'User02', email: 'user2@example.com', isActive: false, subscriptionTier: 'free', role: 'user', joinedAt: '2026-08-12', subscription: { tier: 'free' }, genres: [] },
    { id: 'u3', pseudo: 'User03', email: 'user3@example.com', isActive: true, subscriptionTier: 'free', role: 'admin', joinedAt: '2026-08-10', subscription: { tier: 'free' }, genres: ['Pop', 'Rock'] },
]

const mockModerationTracks: ModerationTrack[] = [
    { id: 't1', title: 'Midnight Drive', artistName: 'Night', artistId: 'a1', albumTitle: 'Midnight Sessions', duration: 222, genreName: 'Afrobeat', status: 'pending', submittedAt: '2026-08-13' },
    { id: 't2', title: 'Track 02', artistName: 'Artist 2', artistId: 'a2', albumTitle: 'Album B', duration: 255, genreName: 'Hip-Hop', status: 'approved', submittedAt: '2026-08-12' },
    { id: 't3', title: 'Track 03', artistName: 'Artist 3', artistId: 'a3', duration: 178, genreName: 'Jazz', status: 'rejected', submittedAt: '2026-08-11' },
]

const mockGenres: Genre[] = [
    { id: 'g1', name: 'Afrobeat' },
    { id: 'g2', name: 'Hip-Hop' },
    { id: 'g3', name: 'Pop' },
    { id: 'g4', name: 'R&B' },
    { id: 'g5', name: 'Jazz' },
    { id: 'g6', name: 'Rock' },
]

export function useAdminStats() {
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error] = useState<string | null>(null)

    useEffect(() => {
        const load = setTimeout(() => {
            setStats(mockStats)
            setIsLoading(false)
        }, 500)
        return () => clearTimeout(load)
    }, [])

    return { stats, isLoading, error }
}

export function useTopTracks() {
    const [tracks, setTracks] = useState<DashboardTrack[]>([])
    const [isLoading, setIsLoading] = useState(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error] = useState<string | null>(null)

    useEffect(() => {
        const load = setTimeout(() => {
            setTracks(mockTopTracks)
            setIsLoading(false)
        }, 600)
        return () => clearTimeout(load)
    }, [])

    return { tracks, isLoading, error }
}

export function useAdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error] = useState<string | null>(null)

    useEffect(() => {
        const load = setTimeout(() => {
            setUsers(mockUsers)
            setIsLoading(false)
        }, 500)
        return () => clearTimeout(load)
    }, [])

    const suspendUser = async (userId: string) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u))
    }

    const deleteUser = async (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId))
    }

    return { users, isLoading, error, suspendUser, deleteUser }
}

export function useModerationTracks(filterStatus?: string) {
    const [tracks, setTracks] = useState<ModerationTrack[]>([])
    const [isLoading, setIsLoading] = useState(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error] = useState<string | null>(null)

    useEffect(() => {
        const load = setTimeout(() => {
            const filtered = filterStatus && filterStatus !== 'all'
                ? mockModerationTracks.filter(t => t.status === filterStatus)
                : mockModerationTracks
            setTracks(filtered)
            setIsLoading(false)
        }, 500)
        return () => clearTimeout(load)
    }, [filterStatus])

    const updateStatus = async (trackId: string, status: 'approved' | 'rejected') => {
        setTracks(prev => prev.map(t => t.id === trackId ? { ...t, status } : t))
    }

    return { tracks, isLoading, error, updateStatus }
}

export function useGenres() {
    const [genres, setGenres] = useState<Genre[]>([])
    const [isLoading, setIsLoading] = useState(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error] = useState<string | null>(null)

    useEffect(() => {
        const load = setTimeout(() => {
            setGenres(mockGenres)
            setIsLoading(false)
        }, 400)
        return () => clearTimeout(load)
    }, [])

    const createGenre = async (name: string) => {
        const newGenre: Genre = { id: `g${Date.now()}`, name }
        setGenres(prev => [...prev, newGenre])
    }

    const updateGenre = async (id: string, name: string) => {
        setGenres(prev => prev.map(g => g.id === id ? { ...g, name } : g))
    }

    const deleteGenre = async (id: string) => {
        setGenres(prev => prev.filter(g => g.id !== id))
    }

    return { genres, isLoading, error, createGenre, updateGenre, deleteGenre }
}