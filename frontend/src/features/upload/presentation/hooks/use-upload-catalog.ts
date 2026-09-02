import { useEffect, useState } from 'react'
import { uploadCatalogService } from '../../data/upload-catalog.service'
import type { Album } from '../../../../shared/types/album'
import type { Genre } from '../../../../shared/types/genre'

export function useAlbums(artistId?: string) {
    const [albums, setAlbums] = useState<Album[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const reload = () => {
        if (!artistId) { setAlbums([]); return }
        setIsLoading(true)
        uploadCatalogService.listAlbumsByArtist(artistId).then(setAlbums).finally(() => setIsLoading(false))
    }

    useEffect(reload, [artistId])

    return { albums, isLoading, reload }
}

export function useGenres() {
    const [genres, setGenres] = useState<Genre[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        uploadCatalogService.listGenres()
            .then((data) => { setGenres(data); setError(null) })
            .catch(() => setError('Impossible de charger la liste des genres.'))
            .finally(() => setIsLoading(false))
    }, [])

    return { genres, isLoading, error }
}