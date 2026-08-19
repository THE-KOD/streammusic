import { AuthTokens } from './auth.types';

export interface DecodedToken {
    sub: string;
    exp: number;
}

export interface TokenGenerator {
    generateTokens(utilisateurId: string): AuthTokens;
    verifyAccessToken(token: string): DecodedToken | null;
    verifyRefreshToken(token: string): DecodedToken | null;
    hashRefreshToken(token: string): string;
    getRefreshTokenExpiration(token: string): Date;
}

export const TOKEN_GENERATOR = Symbol('TOKEN_GENERATOR');