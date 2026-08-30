import { useEffect, useState } from 'react'
import { userService } from '../../data/user.service'

export interface User {
    id: string
    pseudo: string
    email: string
    avatarUrl?: string
    joinedAt: Date
    isActive: boolean
    authMethod: 'password' | 'oauth'
    genres: string[] // noms de genres, pas des ids — GenreSelector opère sur des noms
}

export function useUser() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [allGenres, setAllGenres] = useState<string[]>([])
    // Catalogue complet id+nom, gardé en mémoire pour traduire les noms
    // choisis dans GenreSelector vers les ids attendus par l'API, et
    // inversement au chargement.
    const [genreCatalog, setGenreCatalog] = useState<{ id: string; nom: string }[]>([])

    useEffect(() => {
        const load = async () => {
            setIsLoading(true)
            try {
                const [me, genres, prefIds] = await Promise.all([
                    userService.getMe(),
                    userService.listAllGenres(),
                    userService.getGenrePreferenceIds(),
                ])
                setGenreCatalog(genres)
                setAllGenres(genres.map((g) => g.nom))
                const prefNames = genres.filter((g) => prefIds.includes(g.id)).map((g) => g.nom)
                setUser({
                    id: me.id,
                    pseudo: me.pseudo,
                    email: me.email,
                    avatarUrl: me.photoProfilUrl,
                    joinedAt: new Date(me.dateInscription),
                    isActive: me.statutCompte === 'ACTIF',
                    authMethod: me.authMethod,
                    genres: prefNames,
                })
            } finally {
                setIsLoading(false)
            }
        }
        load()
    }, [])

    const updateUser = async (updates: Partial<User>) => {
        const updated = await userService.updateMe({ pseudo: updates.pseudo })
        setUser((prev) => (prev ? { ...prev, pseudo: updated.pseudo } : null))
    }

    const updateGenres = async (genreNames: string[]) => {
        const ids = genreCatalog.filter((g) => genreNames.includes(g.nom)).map((g) => g.id)
        await userService.updateGenrePreferenceIds(ids)
        setUser((prev) => (prev ? { ...prev, genres: genreNames } : null))
    }

    return { user, isLoading, updateUser, updateGenres, allGenres }
}