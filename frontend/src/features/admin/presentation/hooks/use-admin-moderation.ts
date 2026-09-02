import { useEffect, useState } from 'react'
import { adminModerationService } from '../../data/admin.service'
import type { ModerationTrack } from '../../domain/admin.entity'

export function useModerationTracks(filterStatus?: string) {
    const [tracks, setTracks] = useState<ModerationTrack[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const reload = () => {
        setIsLoading(true)
        adminModerationService.list(filterStatus)
            .then((data) => { setTracks(data); setError(null) })
            .catch(() => setError('Impossible de charger la file de modération.'))
            .finally(() => setIsLoading(false))
    }

    useEffect(reload, [filterStatus])

    const updateStatus = async (trackId: string, status: 'approved' | 'rejected') => {
        await adminModerationService.updateStatus(trackId, status)
        reload()
    }

    return { tracks, isLoading, error, updateStatus }
}