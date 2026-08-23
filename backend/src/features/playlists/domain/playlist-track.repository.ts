// Type spécifique à playlists (nom de champ "titreId", pas "id" générique) —
// converti vers/depuis la forme générique OrderedEntry au moment d'appeler
// reorderList(), voir playlists.service.ts.
export interface PlaylistTrackEntry {
    titreId: string;
    ordre: number;
}

export interface PlaylistTrackRepository {
    list(playlistId: string): Promise<PlaylistTrackEntry[]>;
    count(playlistId: string): Promise<number>;
    isPresent(playlistId: string, titreId: string): Promise<boolean>;
    getMaxOrdre(playlistId: string): Promise<number>;
    add(playlistId: string, titreId: string, ordre: number): Promise<void>;
    remove(playlistId: string, titreId: string): Promise<void>;
    reorderAll(playlistId: string, entries: PlaylistTrackEntry[]): Promise<void>;
}

export const PLAYLIST_TRACK_REPOSITORY = Symbol('PLAYLIST_TRACK_REPOSITORY');