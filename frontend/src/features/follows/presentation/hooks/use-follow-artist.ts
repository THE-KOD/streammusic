import { useState } from 'react'
import { followsService } from '../../data/follows-mock.service'

export function useFollowArtist(artistId: string, initialIsFollowing: boolean) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const toggle = async () => {
        setIsLoading(true)
        setError(null)
        try {
            if (isFollowing) {
                await followsService.unfollow(artistId)
                setIsFollowing(false)
            } else {
                await followsService.follow(artistId)
                setIsFollowing(true)
            }
        } catch {
            setError('Impossible de suivre cet artiste.')
        } finally {
            setIsLoading(false)
        }
    }

    return { isFollowing, isLoading, error, toggle, clearError: () => setError(null) }
}