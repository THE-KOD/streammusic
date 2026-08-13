import { useState, useEffect } from 'react'
import type { Track } from '../../../../shared/types/track'

// Mock data
const mockLikedTracks: Track[] = [
    { id: '1', title: 'Titre 1', artistName: 'Artiste 1', artistId: 'a1', albumTitle: 'Album A', duration: 222, coverUrl: '' },
    { id: '2', title: 'Titre 2', artistName: 'Artiste 2', artistId: 'a2', albumTitle: 'Album B', duration: 255, coverUrl: '' },
    { id: '3', title: 'Titre 3', artistName: 'Artiste 3', artistId: 'a3', albumTitle: 'Album C', duration: 178, coverUrl: '' },
]

export function useLibrary() {
    const [tracks, setTracks] = useState<Track[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const load = setTimeout(() => {
            setTracks(mockLikedTracks)
            setIsLoading(false)
        }, 800)
        return () => clearTimeout(load)
    }, [])

    const removeLike = async (trackId: string) => {
        // Simuler suppression
        setTracks(prev => prev.filter(t => t.id !== trackId))
    }

    return { tracks, isLoading, error, removeLike }
}