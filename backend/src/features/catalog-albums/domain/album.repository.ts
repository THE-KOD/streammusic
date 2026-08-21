import { Album } from './album.entity';

export interface AlbumRepository {
    findById(id: string): Promise<Album | null>;
    existsById(id: string): Promise<boolean>; // utilisé plus tard par catalog-tracks
    findAll(): Promise<Album[]>;
    findByArtisteId(artisteId: string): Promise<Album[]>;
    save(album: Album): Promise<Album>;
    delete(id: string): Promise<void>;
}

export const ALBUM_REPOSITORY = Symbol('ALBUM_REPOSITORY');