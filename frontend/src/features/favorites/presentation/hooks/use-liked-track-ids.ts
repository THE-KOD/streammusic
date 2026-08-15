import { useEffect, useState } from 'react'
import { favoritesService } from '../../data/favorites-mock.service'

export function useLikedTrackIds() {
    const [likedTrackIds, setLikedTrackIds] = useState<string[]>([])

    useEffect(() => {
        favoritesService.listLikedTracks().then((tracks) => setLikedTrackIds(tracks.map((t) => t.id)))
    }, [])

    const toggleLike = async (trackId: string) => {
        const isNowLiked = await favoritesService.toggleTrackLike(trackId)
        setLikedTrackIds((prev) => (isNowLiked ? [...prev, trackId] : prev.filter((id) => id !== trackId)))
    }

    return { likedTrackIds, toggleLike }
}