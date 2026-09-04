import { apiClient } from '../../../infrastructure/http/api-client'
import type { LoginCredentials, RegisterPayload } from '../domain/auth.entity'

interface AuthUser {
    id: string
    pseudo: string
    email: string
    isAdmin: boolean
}

interface AuthApiResponse {
    accessToken: string
    refreshToken: string
    utilisateur: AuthUser
}

interface AuthResult {
    tokens: { accessToken: string; refreshToken: string }
    user: AuthUser
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResult> {
        const { data } = await apiClient.post<AuthApiResponse>('/auth/login', { email: credentials.email, motDePasse: credentials.password })
        return { tokens: { accessToken: data.accessToken, refreshToken: data.refreshToken }, user: data.utilisateur }
    },
    async register(payload: RegisterPayload): Promise<AuthResult> {
        const { data } = await apiClient.post<AuthApiResponse>('/auth/register', { pseudo: payload.pseudo, email: payload.email, motDePasse: payload.password })
        return { tokens: { accessToken: data.accessToken, refreshToken: data.refreshToken }, user: data.utilisateur }
    },
    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        await apiClient.patch('/auth/password', { currentPassword, newPassword })
    },
}