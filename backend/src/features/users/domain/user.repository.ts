import { Utilisateur } from './user.entity';

export interface UtilisateurRepository {
    findById(id: string): Promise<Utilisateur | null>;
    findByEmail(email: string): Promise<Utilisateur | null>;
    findByPseudo(pseudo: string): Promise<Utilisateur | null>;
    save(utilisateur: Utilisateur): Promise<Utilisateur>;
}

export const UTILISATEUR_REPOSITORY = Symbol('UTILISATEUR_REPOSITORY');