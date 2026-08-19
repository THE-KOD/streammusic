import { Genre } from './genre.entity';

// Interface (port) — data/ devra fournir une implémentation concrète.
// Remarque : pas de méthode "isUsedByAnyTrack()" ici. La contrainte
// ON DELETE RESTRICT du schéma SQL fait déjà ce travail côté base ;
// on se contente d'intercepter son erreur dans l'implémentation (voir data/).
export interface GenreRepository {
    findAll(): Promise<Genre[]>;
    findById(id: string): Promise<Genre | null>;
    findByNom(nom: string): Promise<Genre | null>;
    save(genre: Genre): Promise<Genre>;
    delete(id: string): Promise<void>;
}

export const GENRE_REPOSITORY = Symbol('GENRE_REPOSITORY');