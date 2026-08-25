// Barrel publique — playlists, favorites, listening-history, queue et
// suggestions en dépendront tous : Track est l'entité pivot du domaine.
export { Track } from './domain/track.entity';
export type { TrackProps, StatutModeration, MetadonneesModifiables } from './domain/track.entity';
export type { TrackRepository, TrackFilters } from './domain/track.repository';
export { TRACK_REPOSITORY } from './domain/track.repository';
export * from './domain/errors';
export { TrackValidatedEvent, TRACK_VALIDATED_EVENT } from './domain/events/track-validated.event';
export { TrackUnpublishedEvent, TRACK_UNPUBLISHED_EVENT } from './domain/events/track-unpublished.event';