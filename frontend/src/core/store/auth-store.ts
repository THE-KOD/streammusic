import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '../../infrastructure/http/api-client'

interface AuthUser {
    id: string
    pseudo: string
    email: string
}

interface AuthState {
    accessToken: string | null
    refreshToken: string | null
    user: AuthUser | null
    isAuthenticated: boolean
    isAdmin: boolean
    // isAdmin fourni directement par le backend à la connexion — plus de
    // vérification a posteriori via une route protégée (voir explication
    // du fix du 403 systématique).
    setSession: (accessToken: string, refreshToken: string, user: AuthUser, isAdmin: boolean) => void
    setTokens: (accessToken: string, refreshToken: string) => void
    clearSession: () => void
    logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            accessToken: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            setSession: (accessToken, refreshToken, user, isAdmin) => set({ accessToken, refreshToken, user, isAuthenticated: true, isAdmin }),
            setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
            clearSession: () => set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false, isAdmin: false }),
            logout: async () => {
                try {
                    await apiClient.post('/auth/logout')
                } catch {
                    // La déconnexion locale doit réussir même si l'appel réseau échoue.
                } finally {
                    get().clearSession()
                }
            },
        }),
        { name: 'auth-storage' },
    ),
)