export interface LoginCredentials {
    email: string;
    motDePasse: string;
}

export interface RegisterPayload {
    pseudo: string;
    email: string;
    motDePasse: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}