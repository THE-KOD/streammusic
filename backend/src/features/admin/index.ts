export { Administrateur } from './domain/administrateur.entity';
export type { AdministrateurRepository } from './domain/administrateur.repository';
export { ADMINISTRATEUR_REPOSITORY } from './domain/administrateur.repository';
export * from './domain/errors';
// Exception documentée (même esprit que useFollowArtist côté frontend) :
// un guard est un utilitaire technique réutilisable, pas de la logique
// d'affichage propre à une feature — catalog-tracks et catalog-genres
// en ont besoin pour protéger leurs routes de modération/gestion.
export { AdminGuard } from './presentation/guards/admin.guard';