import { useState, useEffect } from 'react'
import type { Track } from '../../../../shared/types/track'

interface HistoryEntry {
    id: string
    track: Track
    listenedAt: Date
}

// Mock data
const mockHistory: HistoryEntry[] = [
    {
        id: 'h1',
        track: { id: '1', title: 'Titre 1', artistName: 'Artiste 1', artistId: 'a1', duration: 222 },
        listenedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // aujourd'hui
    },
    {
        id: 'h2',
        track: { id: '2', title: 'Titre 2', artistName: 'Artiste 2', artistId: 'a2', duration: 255 },
        listenedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // aujourd'hui
    },
    {
        id: 'h3',
        track: { id: '3', title: 'Titre 3', artistName: 'Artiste 3', artistId: 'a3', duration: 178 },
        listenedAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // hier
    },
    {
        id: 'h4',
        track: { id: '4', title: 'Titre 4', artistName: 'Artiste 1', artistId: 'a1', duration: 301 },
        listenedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 jours
    },
]

export function useHistory() {
    const [entries, setEntries] = useState<HistoryEntry[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const load = setTimeout(() => {
            setEntries(mockHistory)
            setIsLoading(false)
        }, 800)
        return () => clearTimeout(load)
    }, [])

    return { entries, isLoading, error }
}