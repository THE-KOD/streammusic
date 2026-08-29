import { useEffect, useState } from 'react'
import { favoritesService } from '../../data/favorites.service'
import type { Track } from '../../../../shared/types/track'

export function useLikedTracks() {
    const [tracks, setTracks] = useState<Track[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const reload = () => {
        setIsLoading(true)
        favoritesService.listLikedTracks()
            .then((data) => { setTracks(data); setError(null) })
            .catch(() => setError('Impossible de charger vos titres likés.'))
            .finally(() => setIsLoading(false))
    }

    useEffect(reload, [])

    const removeLike = async (trackId: string) => {
        await favoritesService.toggleTrackLike(trackId)
        reload()
    }

    return { tracks, isLoading, error, removeLike }
}