import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ADMINISTRATEUR_REPOSITORY } from '../../domain/administrateur.repository';
import type { AdministrateurRepository } from '../../domain/administrateur.repository';
import { AdministrateurRequisError } from '../../domain/errors';

// S'utilise TOUJOURS après JwtAuthGuard (qui peuple request.user) :
// @UseGuards(JwtAuthGuard, AdminGuard)
@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        @Inject(ADMINISTRATEUR_REPOSITORY) private readonly administrateurRepository: AdministrateurRepository,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId: string | undefined = request.user;
        if (!userId) throw new AdministrateurRequisError();

        const estAdmin = await this.administrateurRepository.existsById(userId);
        if (!estAdmin) throw new AdministrateurRequisError();
        return true;
    }
}