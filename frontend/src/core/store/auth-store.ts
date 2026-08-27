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
    setSession: (accessToken: string, refreshToken: string, user: AuthUser) => void
    setTokens: (accessToken: string, refreshToken: string) => void
    // Local uniquement — utilisé par l'intercepteur HTTP quand un refresh échoue.
    // Ne doit jamais rappeler le backend (la session y est déjà invalide).
    clearSession: () => void
    // Déconnexion "volontaire" — révoque aussi la session côté serveur.
    logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            accessToken: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
            setSession: (accessToken, refreshToken, user) => set({ accessToken, refreshToken, user, isAuthenticated: true }),
            setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
            clearSession: () => set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false }),
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