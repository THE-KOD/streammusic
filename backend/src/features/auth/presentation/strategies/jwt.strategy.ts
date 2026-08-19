import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UTILISATEUR_REPOSITORY } from '../../../users';
import type { UtilisateurRepository } from '../../../users';
import { CompteSuspenduError } from '../../domain/errors';

interface JwtPayload {
    sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        config: ConfigService,
        @Inject(UTILISATEUR_REPOSITORY) private readonly utilisateurRepository: UtilisateurRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_ACCESS_SECRET')!,
        });
    }

    async validate(payload: JwtPayload): Promise<string> {
        const utilisateur = await this.utilisateurRepository.findById(payload.sub);
        if (!utilisateur || !utilisateur.estActif) throw new CompteSuspenduError();
        return utilisateur.id; // devient request.user, lu par @CurrentUser()
    }
}