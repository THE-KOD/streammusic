import { useState } from 'react'
import { searchService } from '../../data/search.service'
import type { SearchFilters, SearchResults } from '../../domain/search.types'

export function useSearch() {
    const [query, setQuery] = useState('')
    const [filters, setFilters] = useState<SearchFilters>({})
    const [results, setResults] = useState<SearchResults | null>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const search = async () => {
        if (!query.trim()) return
        setIsSearching(true)
        setError(null)
        try {
            setResults(await searchService.search(query.trim(), filters))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'La recherche a échoué.')
        } finally {
            setIsSearching(false)
        }
    }

    const reset = () => {
        setFilters({})
        setQuery('')
        setResults(null)
        setError(null)
    }

    return { query, setQuery, filters, setFilters, results, isSearching, error, search, reset }
}