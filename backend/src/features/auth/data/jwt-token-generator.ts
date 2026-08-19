import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHash, randomUUID } from 'crypto';
import { DecodedToken, TokenGenerator } from '../domain/token-generator';
import { AuthTokens } from '../domain/auth.types';

@Injectable()
export class JwtTokenGenerator implements TokenGenerator {
    constructor(
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
    ) {}

    generateTokens(utilisateurId: string): AuthTokens {
        const accessToken = this.jwtService.sign(
            { sub: utilisateurId, jti: randomUUID() },
            {
                secret: this.config.get<string>('JWT_ACCESS_SECRET'),
                expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRATION') as JwtSignOptions['expiresIn'],
            },
        );
        const refreshToken = this.jwtService.sign(
            { sub: utilisateurId, jti: randomUUID() },
            {
                secret: this.config.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRATION') as JwtSignOptions['expiresIn'],
            },
        );
        return { accessToken, refreshToken };
    }

    verifyAccessToken(token: string): DecodedToken | null {
        return this.verify(token, this.config.get<string>('JWT_ACCESS_SECRET')!);
    }

    verifyRefreshToken(token: string): DecodedToken | null {
        return this.verify(token, this.config.get<string>('JWT_REFRESH_SECRET')!);
    }

    hashRefreshToken(token: string): string {
        return createHash('sha256').update(token).digest('hex');
    }

    getRefreshTokenExpiration(token: string): Date {
        const decoded = this.jwtService.decode(token) as { exp: number };
        return new Date(decoded.exp * 1000);
    }

    private verify(token: string, secret: string): DecodedToken | null {
        try {
            return this.jwtService.verify<DecodedToken>(token, { secret });
        } catch {
            return null;
        }
    }
}