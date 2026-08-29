import { useState } from 'react'
import { searchService, type SearchResults } from '../../data/search.service'
import type { SearchFilters } from '../../domain/search.entity'

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
            const data = await searchService.search(query, filters)
            setResults(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
        } finally {
            setIsSearching(false)
        }
    }

    const reset = () => {
        setFilters({})
        setResults(null)
        setError(null)
    }

    return { query, setQuery, filters, setFilters, results, isSearching, error, search, reset }
}