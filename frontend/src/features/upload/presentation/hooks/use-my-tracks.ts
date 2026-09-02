import { useEffect, useState } from 'react'
import { myTracksService } from '../../data/my-tracks.service'
import type { MyTrack } from '../../domain/my-track.entity'

export function useMyTracks() {
    const [tracks, setTracks] = useState<MyTrack[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        myTracksService.listMine().then(setTracks).catch(() => setTracks([])).finally(() => setIsLoading(false))
    }, [])

    return { tracks, isLoading }
}