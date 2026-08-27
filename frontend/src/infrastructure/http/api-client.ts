import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../../core/store/auth-store'
import { AppError } from './app-error'

const baseURL = import.meta.env.VITE_API_BASE_URL
if (!baseURL) {
    throw new Error('VITE_API_BASE_URL manquant — vérifie ton fichier .env')
}

export const apiClient = axios.create({ baseURL })

// Injecte le token d'accès sur chaque requête sortante.
apiClient.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
    return config
})

// Empêche plusieurs rafraîchissements simultanés si plusieurs requêtes
// échouent en même temps (ex. plusieurs appels lancés en parallèle
// au chargement d'un écran) — un seul refresh, les autres attendent.
let isRefreshing = false
let waitingQueue: Array<() => void> = []

interface RetryableConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableConfig | undefined

        const isAuthRefreshCall = originalRequest?.url === '/auth/refresh'
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRefreshCall) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    waitingQueue.push(() => resolve(apiClient(originalRequest)))
                })
            }

            originalRequest._retry = true
            isRefreshing = true
            const refreshToken = useAuthStore.getState().refreshToken

            if (!refreshToken) {
                useAuthStore.getState().clearSession()
                isRefreshing = false
                return Promise.reject(normalizeError(error))
            }

            try {
                const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken })
                useAuthStore.getState().setTokens(data.accessToken, data.refreshToken)
                waitingQueue.forEach((resolveQueued) => resolveQueued())
                waitingQueue = []
                return apiClient(originalRequest)
            } catch {
                useAuthStore.getState().clearSession()
                waitingQueue = []
                return Promise.reject(normalizeError(error))
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(normalizeError(error))
    },
)

function normalizeError(error: AxiosError): AppError {
    const data = error.response?.data as { error?: { code: string; message: string } } | undefined
    if (data?.error) return new AppError(data.error.code, data.error.message, error.response?.status)
    return new AppError('NETWORK_ERROR', 'Impossible de contacter le serveur. Vérifie ta connexion.', error.response?.status)
}