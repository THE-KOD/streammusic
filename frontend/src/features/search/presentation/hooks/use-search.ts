import { useState } from 'react'
import { searchService } from '../../data/search-mock.service'
import type { SearchFilters, SearchResults } from '../../domain/search.entity'

export function useSearch() {
    const [query, setQuery] = useState('')
    const [filters, setFilters] = useState<SearchFilters>({})
    const [results, setResults] = useState<SearchResults | null>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const search = async () => {
        if (!query.trim()) { setResults(null); return }
        setIsSearching(true)
        setError(null)
        try {
            setResults(await searchService.search(query, filters))
        } catch {
            setError('La recherche a échoué. Réessaie.')
        } finally {
            setIsSearching(false)
        }
    }

    const reset = () => { setQuery(''); setFilters({}); setResults(null); setError(null) }

    return { query, setQuery, filters, setFilters, results, isSearching, error, search, reset }
}