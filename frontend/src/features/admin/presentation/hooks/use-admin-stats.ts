import { useEffect, useState } from 'react'
import { adminStatsService } from '../../data/admin-mock.service'
import type { AdminStats, DashboardTrack } from '../../domain/admin.entity'

export function useAdminStats() {
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        adminStatsService.getStats()
            .then((data) => { setStats(data); setError(null) })
            .catch(() => setError('Impossible de charger les statistiques.'))
            .finally(() => setIsLoading(false))
    }, [])

    return { stats, isLoading, error }
}

export function useTopTracks() {
    const [tracks, setTracks] = useState<DashboardTrack[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        adminStatsService.getTopTracks()
            .then((data) => { setTracks(data); setError(null) })
            .catch(() => setError('Impossible de charger les titres populaires.'))
            .finally(() => setIsLoading(false))
    }, [])

    return { tracks, isLoading, error }
}