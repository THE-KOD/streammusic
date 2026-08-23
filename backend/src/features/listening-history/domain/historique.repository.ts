import { HistoriqueEcoute } from './historique-ecoute.entity';

export interface HistoriqueRepository {
    save(entry: HistoriqueEcoute): Promise<HistoriqueEcoute>;
    listByUtilisateur(utilisateurId: string, limit: number): Promise<HistoriqueEcoute[]>;
    clearForUtilisateur(utilisateurId: string): Promise<void>;
}

export const HISTORIQUE_REPOSITORY = Symbol('HISTORIQUE_REPOSITORY');