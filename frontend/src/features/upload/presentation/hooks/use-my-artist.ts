import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../../core/store/auth-store'
import { uploadCatalogService } from '../../data/upload-catalog.service'

export function useMyArtist() {
    const userId = useAuthStore((state) => state.user?.id)
    const [artist, setArtist] = useState<{ id: string; pseudo: string } | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const reload = () => {
        if (!userId) { setIsLoading(false); return }
        setIsLoading(true)
        uploadCatalogService.getMyArtistProfile(userId).then(setArtist).finally(() => setIsLoading(false))
    }

    useEffect(reload, [userId])

    return { artist, isLoading, reload }
}