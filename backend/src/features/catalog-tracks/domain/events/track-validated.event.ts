// Émis quand un titre passe au statut VALIDE (voir TracksService.moderer()).
// Design volontaire : catalog-tracks ne connaît ni n'importe jamais notifications —
// il émet un événement neutre, notifications s'y abonne de son côté. Ça évite une
// dépendance circulaire : notifications a déjà besoin de catalog-tracks (vérifier
// qu'un titre existe), donc catalog-tracks ne peut pas dépendre de notifications
// en retour sans créer un cycle TracksModule -> NotificationsModule -> TracksModule.
export class TrackValidatedEvent {
    constructor(
        public readonly titreId: string,
        public readonly titreNom: string,
        public readonly artisteId: string,
    ) {}
}

export const TRACK_VALIDATED_EVENT = 'track.validated';