// Barrel publique — c'est le SEUL fichier qu'une autre feature (ex. catalog-tracks,
// qui référence un genre sur chaque titre) a le droit d'importer.
export { Genre } from './domain/genre.entity';
export type { GenreProps } from './domain/genre.entity';
export type { GenreRepository } from './domain/genre.repository';
export { GENRE_REPOSITORY } from './domain/genre.repository';
export * from './domain/errors';