export interface TrackSearchDocument {
    id: string;
    titre: string;
    artisteId: string;
    artisteNom: string;
    albumId: string | null;
    albumTitre: string | null;
    genreId: string;
    genreNom: string;
    duree: number;
    fichierAudioUrl: string; // nouveau — sans ça, aucun résultat de recherche n'est réellement jouable
    dateSortie: string | null;
    pochetteUrl: string | null;
}

export interface TrackSearchFilters {
    genreId?: string;
    dureeMin?: number;
    dureeMax?: number;
}

export interface TrackSearchRepository {
    indexTrack(doc: TrackSearchDocument): Promise<void>;
    removeTrack(id: string): Promise<void>;
    search(query: string, filters?: TrackSearchFilters, limit?: number): Promise<TrackSearchDocument[]>;
}

export const TRACK_SEARCH_REPOSITORY = Symbol('TRACK_SEARCH_REPOSITORY');