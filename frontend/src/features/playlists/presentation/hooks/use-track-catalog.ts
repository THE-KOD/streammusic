import { useEffect, useState } from 'react'
import { trackCatalogService } from '../../data/track-catalog.service'
import type { Track } from '../../../../shared/types/track'

export function useTrackCatalog() {
    const [tracks, setTracks] = useState<Track[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        trackCatalogService.listAll().then(setTracks).catch(() => setTracks([])).finally(() => setIsLoading(false))
    }, [])

    return { tracks, isLoading }
}