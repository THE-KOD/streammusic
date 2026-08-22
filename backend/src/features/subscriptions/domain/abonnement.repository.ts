import { Abonnement } from './abonnement.entity';

export interface AbonnementRepository {
    findByUtilisateurId(utilisateurId: string): Promise<Abonnement | null>;
    save(abonnement: Abonnement): Promise<Abonnement>;
}

export const ABONNEMENT_REPOSITORY = Symbol('ABONNEMENT_REPOSITORY');