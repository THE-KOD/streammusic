import { Playlist } from './playlist.entity';

export interface PlaylistRepository {
    findById(id: string): Promise<Playlist | null>;
    findByProprietaire(proprietaireId: string): Promise<Playlist[]>;
    save(playlist: Playlist): Promise<Playlist>;
    delete(id: string): Promise<void>;
}

export const PLAYLIST_REPOSITORY = Symbol('PLAYLIST_REPOSITORY');