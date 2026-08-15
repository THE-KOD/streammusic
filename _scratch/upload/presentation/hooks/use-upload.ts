// features/upload/presentation/hooks/use-upload.ts
import { useState, useEffect } from 'react'
import type { Artist, Album, Genre } from '../../../../shared/types/track'

const mockArtists: Artist[] = [
    { id: 'a1', name: 'Artiste 1' },
    { id: 'a2', name: 'Artiste 2' },
    { id: 'a3', name: 'Artiste 3' },
]

const mockAlbums: Album[] = [
    { id: 'al1', title: 'Album A', artistId: 'a1' },
    { id: 'al2', title: 'Album B', artistId: 'a1' },
    { id: 'al3', title: 'Album C', artistId: 'a2' },
]

const mockGenres: Genre[] = [
    { id: 'g1', name: 'Afrobeat' },
    { id: 'g2', name: 'Hip-Hop' },
    { id: 'g3', name: 'Pop' },
    { id: 'g4', name: 'R&B' },
    { id: 'g5', name: 'Jazz' },
    { id: 'g6', name: 'Rock' },
]

export function useArtists() {
    const [artists, setArtists] = useState<Artist[]>([])
    const [isLoading, setIsLoading] = useState(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error] = useState<string | null>(null) // conservé pour l'interface mais jamais modifié

    useEffect(() => {
        const load = setTimeout(() => {
            setArtists(mockArtists)
            setIsLoading(false)
        }, 500)
        return () => clearTimeout(load)
    }, [])

    return { artists, isLoading, error }
}

export function useAlbums(artistId?: string) {
    const [albums, setAlbums] = useState<Album[]>([])
    const [isLoading, setIsLoading] = useState(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error] = useState<string | null>(null)

    useEffect(() => {
        const load = setTimeout(() => {
            const filtered = artistId ? mockAlbums.filter(a => a.artistId === artistId) : []
            setAlbums(filtered)
            setIsLoading(false)
        }, 300)
        return () => clearTimeout(load)
    }, [artistId])

    return { albums, isLoading, error }
}

export function useGenres() {
    const [genres, setGenres] = useState<Genre[]>([])
    const [isLoading, setIsLoading] = useState(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error] = useState<string | null>(null)

    useEffect(() => {
        const load = setTimeout(() => {
            setGenres(mockGenres)
            setIsLoading(false)
        }, 500)
        return () => clearTimeout(load)
    }, [])

    return { genres, isLoading, error }
}

export function useSubmitTrack() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const submit = async (_data: any) => {
        setIsSubmitting(true)
        setError(null)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500))
            return { success: true }
        } catch (err) {
            setError('Erreur lors de la soumission du titre.')
            throw err
        } finally {
            setIsSubmitting(false)
        }
    }

    return { isSubmitting, error, submit }
}