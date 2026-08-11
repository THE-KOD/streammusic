import type { LoginCredentials, RegisterPayload, AuthUser } from '../domain/auth.entity'
import { InvalidCredentialsError, EmailAlreadyExistsError } from '../domain/errors'

const FAKE_DELAY_MS = 800

const MOCK_USER: AuthUser = {
    id: 'mock-user-1',
    pseudo: 'Jane Doe',
    email: 'jane@example.com',
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthUser> {
        await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS))
        if (credentials.email !== MOCK_USER.email || credentials.password !== 'password123') {
            throw new InvalidCredentialsError()
        }
        return MOCK_USER
    },

    async register(payload: RegisterPayload): Promise<AuthUser> {
        await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS))
        if (payload.email === MOCK_USER.email) {
            throw new EmailAlreadyExistsError()
        }
        return { id: 'mock-user-new', pseudo: payload.pseudo, email: payload.email }
    },
}