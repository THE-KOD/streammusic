// Barrel publique — seul point d'entrée autorisé pour catalog-albums/catalog-tracks
// (qui devront vérifier qu'un artisteId existe avant de créer un album/titre).
export { Artiste } from './domain/artiste.entity';
export type { ArtisteProps } from './domain/artiste.entity';
export type { ArtisteRepository } from './domain/artiste.repository';
export { ARTISTE_REPOSITORY } from './domain/artiste.repository';
export * from './domain/errors';