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
    setSession: (accessToken: string, refreshToken: string, user: AuthUser) => void
    setTokens: (accessToken: string, refreshToken: string) => void
    clearSession: () => void
    logout: () => Promise<void>
    // Vérifie le statut admin en tentant une route déjà protégée par
    // AdminGuard côté backend (/admin/stats) — 200 = admin, 403 = non-admin.
    // Volontairement dans ce store (pas dans features/admin) : AppHeader vit
    // dans core/, ne peut pas importer une feature.
    checkAdminStatus: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            accessToken: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            setSession: (accessToken, refreshToken, user) => {
                set({ accessToken, refreshToken, user, isAuthenticated: true })
                void get().checkAdminStatus()
            },
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
            checkAdminStatus: async () => {
                try {
                    await apiClient.get('/admin/stats')
                    set({ isAdmin: true })
                } catch {
                    set({ isAdmin: false })
                }
            },
        }),
        { name: 'auth-storage' },
    ),
)