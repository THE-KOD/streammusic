import { useEffect, useState } from 'react'
import { searchCatalogService, type GenreOption } from '../../data/search-catalog.service'

export function useGenreOptions() {
    const [genres, setGenres] = useState<GenreOption[]>([])

    useEffect(() => {
        searchCatalogService.listGenres().then(setGenres).catch(() => setGenres([]))
    }, [])

    return genres
}