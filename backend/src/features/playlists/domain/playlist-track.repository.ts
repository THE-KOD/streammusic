import { PlaylistTrackEntry } from './reorder-tracks';

// Port séparé du repository Playlist principal : la relation playlist_titre
// est une table de jointure distincte dans le schéma, avec sa propre clé
// composite — même découpage domain/data que favorites/follows.
export interface PlaylistTrackRepository {
    list(playlistId: string): Promise<PlaylistTrackEntry[]>; // trié par ordre croissant
    count(playlistId: string): Promise<number>;
    isPresent(playlistId: string, titreId: string): Promise<boolean>;
    getMaxOrdre(playlistId: string): Promise<number>; // 0 si la playlist est vide
    add(playlistId: string, titreId: string, ordre: number): Promise<void>;
    remove(playlistId: string, titreId: string): Promise<void>;
    // Persiste en une fois le résultat de reorderTracks() — évite d'exposer
    // une méthode "updateOrdre" unitaire qui inviterait à renuméroter
    // incorrectement depuis le service.
    reorderAll(playlistId: string, entries: PlaylistTrackEntry[]): Promise<void>;
}

export const PLAYLIST_TRACK_REPOSITORY = Symbol('PLAYLIST_TRACK_REPOSITORY');