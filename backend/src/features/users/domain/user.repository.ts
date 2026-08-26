import { Utilisateur } from './user.entity';

export interface UtilisateurRepository {
    findById(id: string): Promise<Utilisateur | null>;
    findByEmail(email: string): Promise<Utilisateur | null>;
    findByPseudo(pseudo: string): Promise<Utilisateur | null>;
    findAll(): Promise<Utilisateur[]>;
    countAll(): Promise<number>;
    save(utilisateur: Utilisateur): Promise<Utilisateur>;
    delete(id: string): Promise<void>;
}

export const UTILISATEUR_REPOSITORY = Symbol('UTILISATEUR_REPOSITORY');