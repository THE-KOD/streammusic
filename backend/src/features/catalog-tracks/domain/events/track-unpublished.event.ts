// Émis chaque fois qu'un titre CESSE d'être publiquement visible : rejeté,
// repassé en EN_ATTENTE suite à une modification, ou supprimé. Le listener
// de search s'en sert pour retirer le titre de l'index — un titre qu'on ne
// peut plus consulter dans le catalogue ne doit plus jamais remonter dans une recherche.
export class TrackUnpublishedEvent {
    constructor(public readonly titreId: string) {}
}

export const TRACK_UNPUBLISHED_EVENT = 'track.unpublished';