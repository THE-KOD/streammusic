import { Administrateur } from './administrateur.entity';

// Volontairement pas de méthode save() ici — un compte administrateur
// n'est jamais créé via l'application elle-même (voir le script de
// promotion en fin de module), donc le repository applicatif reste
// en lecture seule.
export interface AdministrateurRepository {
    existsById(utilisateurId: string): Promise<boolean>;
    findById(utilisateurId: string): Promise<Administrateur | null>;
}

export const ADMINISTRATEUR_REPOSITORY = Symbol('ADMINISTRATEUR_REPOSITORY');