export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterPayload {
    username: string
    email: string
    password: string
}

// Mock — sera remplacé par de vrais appels axios en Phase 4, sans toucher à presentation/
export async function loginRequest(credentials: LoginCredentials): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    if (credentials.email === 'error@example.com') {
        throw new Error('Email ou mot de passe incorrect.')
    }
}

export async function registerRequest(payload: RegisterPayload): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    if (payload.email === 'used@example.com') {
        throw new Error('Un compte existe déjà avec cette adresse email.')
    }
}