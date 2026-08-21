// Barrel publique — catalog-tracks en aura besoin (chaque titre référence
// optionnellement un album_id).
export { Album } from './domain/album.entity';
export type { AlbumProps } from './domain/album.entity';
export type { AlbumRepository } from './domain/album.repository';
export { ALBUM_REPOSITORY } from './domain/album.repository';
export * from './domain/errors';