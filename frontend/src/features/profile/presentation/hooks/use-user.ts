import { useEffect, useState } from 'react'

export interface User {
    id: string
    pseudo: string
    email: string
    avatarUrl?: string
    joinedAt: Date
    isActive: boolean
    authMethod: 'password' | 'oauth'
    genres: string[]
}

const mockUser: User = {
    id: 'user-1',
    pseudo: 'Night',
    email: 'utilisateur@email.com',
    avatarUrl: '',
    joinedAt: new Date('2026-08-13'),
    isActive: true,
    authMethod: 'password',
    genres: ['Afrobeat', 'Hip-Hop', 'R&B', 'Reggae'],
}

const allGenres = [
    'Afrobeat', 'Hip-Hop', 'Pop', 'R&B', 'Jazz', 'Rock',
    'Gospel', 'Reggae', 'Classique', 'Soul', 'Électro', 'K-Pop',
]

export function useUser() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const load = setTimeout(() => { setUser(mockUser); setIsLoading(false) }, 800)
        return () => clearTimeout(load)
    }, [])

    const updateUser = async (updates: Partial<User>) => {
        setUser((prev) => (prev ? { ...prev, ...updates } : null))
    }
    const updateGenres = async (genres: string[]) => {
        setUser((prev) => (prev ? { ...prev, genres } : null))
    }

    return { user, isLoading, updateUser, updateGenres, allGenres }
}