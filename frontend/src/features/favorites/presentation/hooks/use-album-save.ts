import { useEffect, useState } from 'react'
import { favoritesService } from '../../data/favorites.service'
export function useAlbumSave(albumId: string) {
    const [isSaved, setIsSaved] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        favoritesService.isAlbumSaved(albumId).then(setIsSaved)
    }, [albumId])

    const toggle = async () => {
        setIsLoading(true)
        try {
            setIsSaved(await favoritesService.toggleAlbumSave(albumId))
        } finally {
            setIsLoading(false)
        }
    }

    return { isSaved, isLoading, toggle }
}