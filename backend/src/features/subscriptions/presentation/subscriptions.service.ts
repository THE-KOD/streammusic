import { Inject, Injectable } from '@nestjs/common';
import { ABONNEMENT_REPOSITORY } from '../domain/abonnement.repository';
import type { AbonnementRepository } from '../domain/abonnement.repository';
import { Abonnement } from '../domain/abonnement.entity';
import { AbonnementNotFoundError } from '../domain/errors';

@Injectable()
export class SubscriptionsService {
    constructor(
        @Inject(ABONNEMENT_REPOSITORY) private readonly abonnementRepository: AbonnementRepository,
    ) {}

    async getMine(utilisateurId: string): Promise<Abonnement> {
        const abonnement = await this.abonnementRepository.findByUtilisateurId(utilisateurId);
        // Ne devrait plus jamais arriver pour un compte créé après ce module —
        // voir la création automatique dans auth.service.ts. Peut encore
        // arriver pour un compte de test créé avant ce câblage.
        if (!abonnement) throw new AbonnementNotFoundError(utilisateurId);
        return abonnement;
    }

    async upgradeToPremium(utilisateurId: string): Promise<Abonnement> {
        const abonnement = await this.getMine(utilisateurId);
        abonnement.passerPremium();
        return this.abonnementRepository.save(abonnement);
    }

    async downgradeToFree(utilisateurId: string): Promise<Abonnement> {
        const abonnement = await this.getMine(utilisateurId);
        abonnement.revenirGratuit();
        return this.abonnementRepository.save(abonnement);
    }
}