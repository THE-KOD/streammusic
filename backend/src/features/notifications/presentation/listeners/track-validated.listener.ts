import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TRACK_VALIDATED_EVENT, TrackValidatedEvent } from '../../../catalog-tracks';
import { NotificationsService } from '../notifications.service';

@Injectable()
export class TrackValidatedListener {
    private readonly logger = new Logger(TrackValidatedListener.name);

    constructor(private readonly notificationsService: NotificationsService) {}

    @OnEvent(TRACK_VALIDATED_EVENT)
    async handle(event: TrackValidatedEvent): Promise<void> {
        try {
            await this.notificationsService.notifyFollowersOfNewRelease(event.artisteId, event.titreId, event.titreNom);
        } catch (err) {
            // Sans ce try/catch, un échec ici (emit() n'est jamais attendu par
            // l'appelant) disparaissait silencieusement — ni dans la réponse HTTP,
            // ni forcément visible en terminal. Désormais, toute erreur du listener
            // est explicitement loguée.
            this.logger.error(`Échec de la notification des followers pour le titre ${event.titreId}`, err instanceof Error ? err.stack : err);
        }
    }
}