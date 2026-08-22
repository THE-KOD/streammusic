import { NotFoundError } from '../../../core/errors';

export class AbonnementNotFoundError extends NotFoundError {
    constructor(utilisateurId: string) {
        super(`Aucun abonnement trouvé pour l'utilisateur ${utilisateurId}.`);
    }
}