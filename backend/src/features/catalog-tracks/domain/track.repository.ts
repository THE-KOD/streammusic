import { Track } from './track.entity';

export interface TrackFilters {
    artisteId?: string;
    albumId?: string;
    genreId?: string;
}

export interface TrackRepository {
    findById(id: string): Promise<Track | null>;
    // Catalogue public : uniquement les titres validés, jamais EN_ATTENTE/REJETE
    findAllValide(filters?: TrackFilters): Promise<Track[]>;
    // "Mes titres" : tous les statuts confondus, réservé au propriétaire
    findAllByArtiste(artisteId: string): Promise<Track[]>;
    save(track: Track): Promise<Track>;
    delete(id: string): Promise<void>;
    countByArtiste(artisteId: string): Promise<number>;
    findAllForModeration(statut?: 'EN_ATTENTE' | 'VALIDE' | 'REJETE'): Promise<Track[]>;
}

export const TRACK_REPOSITORY = Symbol('TRACK_REPOSITORY');