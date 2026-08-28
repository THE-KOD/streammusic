import { useEffect, useState } from 'react'
import { apiClient } from '../../../../infrastructure/http/api-client'

interface GenreOption {
    id: string
    nom: string
}

export function useGenreOptions() {
    const [genres, setGenres] = useState<GenreOption[]>([])

    useEffect(() => {
        apiClient.get<GenreOption[]>('/genres').then((res) => setGenres(res.data)).catch(() => setGenres([]))
    }, [])

    return genres
}