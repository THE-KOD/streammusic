import { useEffect, useRef, useState } from 'react'
import { searchService, type SearchResults } from '../../data/search.service'
import type { SearchFilters } from '../../domain/search.entity'

const DEBOUNCE_MS = 400

export function useSearch() {
    const [query, setQuery] = useState('')
    const [filters, setFilters] = useState<SearchFilters>({})
    const [results, setResults] = useState<SearchResults | null>(null)
    const [browseResults, setBrowseResults] = useState<SearchResults | null>(null)
    const [isBrowseLoading, setIsBrowseLoading] = useState(true)
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    useEffect(() => {
        searchService.browse().then(setBrowseResults).catch(() => setBrowseResults(null)).finally(() => setIsBrowseLoading(false))
    }, [])

    const search = async () => {
        if (!query.trim()) { setResults(null); return }
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

    // Recherche automatique après une courte pause de frappe — évite une
    // requête réseau à chaque caractère tapé.
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        if (!query.trim()) { setResults(null); return }
        debounceRef.current = setTimeout(() => { void search() }, DEBOUNCE_MS)
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, filters])

    const reset = () => {
        setFilters({})
        setError(null)
    }

    return { query, setQuery, filters, setFilters, results, browseResults, isBrowseLoading, isSearching, error, search, reset }
}