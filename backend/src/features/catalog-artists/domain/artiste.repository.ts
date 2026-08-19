import { Artiste } from './artiste.entity';

export interface ArtisteRepository {
    findById(id: string): Promise<Artiste | null>;
    // Distinct de findById : évite de charger l'objet complet juste pour
    // vérifier une existence (utilisé par catalog-albums/tracks plus tard).
    existsById(id: string): Promise<boolean>;
    findAll(): Promise<Artiste[]>;
    save(artiste: Artiste): Promise<Artiste>;
}

export const ARTISTE_REPOSITORY = Symbol('ARTISTE_REPOSITORY');