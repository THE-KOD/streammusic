import { useEffect, useState } from 'react'
import { favoritesService } from '../../data/favorites-mock.service'
import type { Album } from '../../../../shared/types/album'

export function useSavedAlbums() {
    const [albums, setAlbums] = useState<Album[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const reload = () => {
        setIsLoading(true)
        favoritesService.listSavedAlbums()
            .then((data) => { setAlbums(data); setError(null) })
            .catch(() => setError('Impossible de charger vos albums sauvegardés.'))
            .finally(() => setIsLoading(false))
    }

    useEffect(reload, [])

    const unsave = async (albumId: string) => {
        await favoritesService.toggleAlbumSave(albumId)
        reload()
    }

    return { albums, isLoading, error, unsave }
}