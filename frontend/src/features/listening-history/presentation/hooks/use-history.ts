import { useEffect, useState } from 'react'
import { CATALOG_TRACKS_MOCK } from '../../../../shared/mocks/catalog-tracks.mock'
import type { Track } from '../../../../shared/types/track'

interface HistoryEntry {
    id: string
    track: Track
    listenedAt: Date
}

const findTrack = (id: string) => CATALOG_TRACKS_MOCK.find((t) => t.id === id)!

const mockHistory: HistoryEntry[] = [
    { id: 'h1', track: findTrack('t1'), listenedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 'h2', track: findTrack('t2'), listenedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) },
    { id: 'h3', track: findTrack('t3'), listenedAt: new Date(Date.now() - 36 * 60 * 60 * 1000) },
    { id: 'h4', track: findTrack('t4'), listenedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
]

export function useHistory() {
    const [entries, setEntries] = useState<HistoryEntry[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const load = setTimeout(() => { setEntries(mockHistory); setIsLoading(false) }, 800)
        return () => clearTimeout(load)
    }, [])

    return { entries, isLoading }
}