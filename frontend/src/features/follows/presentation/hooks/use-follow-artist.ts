import { useEffect, useState } from 'react'
import { followsService } from '../../data/follows.service'
import { AppError } from '../../../../infrastructure/http/app-error'

export function useFollowArtist(artistId: string, initialIsFollowing = false) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // initialIsFollowing n'est qu'un affichage optimiste temporaire — le vrai
    // état vient toujours du serveur, récupéré ici dès que l'id est connu.
    useEffect(() => {
        if (!artistId) return
        followsService.getStatus(artistId).then(setIsFollowing).catch(() => {
            // Échec silencieux : on garde l'état optimiste plutôt que de bloquer l'affichage.
        })
    }, [artistId])

    const toggle = async () => {
        setIsLoading(true)
        setError(null)
        const next = !isFollowing
        setIsFollowing(next) // optimiste
        try {
            if (next) await followsService.follow(artistId)
            else await followsService.unfollow(artistId)
        } catch (err) {
            setIsFollowing(!next) // rollback si le serveur refuse
            setError(err instanceof AppError ? err.message : 'Une erreur est survenue.')
        } finally {
            setIsLoading(false)
        }
    }

    const clearError = () => setError(null)

    return { isFollowing, isLoading, error, toggle, clearError }
}