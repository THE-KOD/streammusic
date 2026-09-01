import { useEffect, useState } from 'react'
import { historyService, type HistoryEntry } from '../../data/history.service'

export function useHistory() {
    const [entries, setEntries] = useState<HistoryEntry[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        historyService.listMine().then(setEntries).catch(() => setEntries([])).finally(() => setIsLoading(false))
    }, [])

    return { entries, isLoading }
}