export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterPayload {
    pseudo: string
    email: string
    password: string
}

export interface AuthUser {
    id: string
    pseudo: string
    email: string
    photoProfilUrl?: string
}