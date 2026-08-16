import { useEffect, useState } from 'react'
import { adminGenresService } from '../../data/admin-mock.service'
import type { Genre } from '../../../../shared/types/genre'

export function useAdminGenres() {
    const [genres, setGenres] = useState<Genre[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const reload = () => {
        setIsLoading(true)
        adminGenresService.list()
            .then((data) => { setGenres([...data]); setError(null) })
            .catch(() => setError('Impossible de charger les genres.'))
            .finally(() => setIsLoading(false))
    }

    useEffect(reload, [])

    const createGenre = async (name: string) => { await adminGenresService.create(name); reload() }
    const updateGenre = async (id: string, name: string) => { await adminGenresService.update(id, name); reload() }
    const deleteGenre = async (id: string) => { await adminGenresService.remove(id); reload() }

    return { genres, isLoading, error, createGenre, updateGenre, deleteGenre }
}