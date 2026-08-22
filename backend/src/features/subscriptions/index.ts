// Barrel publique — auth en a désormais besoin (création automatique
// de l'abonnement à l'inscription, voir auth.service.ts plus bas).
export { Abonnement } from './domain/abonnement.entity';
export type { AbonnementProps, TypeAbonnement } from './domain/abonnement.entity';
export type { AbonnementRepository } from './domain/abonnement.repository';
export { ABONNEMENT_REPOSITORY } from './domain/abonnement.repository';
export * from './domain/errors';