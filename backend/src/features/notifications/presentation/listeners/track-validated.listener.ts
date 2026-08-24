import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TRACK_VALIDATED_EVENT, TrackValidatedEvent } from '../../../catalog-tracks';
import { NotificationsService } from '../notifications.service';

// Le pont entre catalog-tracks (qui émet, sans rien savoir de notifications)
// et la création réelle des notifications. C'EST ICI que la dépendance vers
// follows/catalog-tracks existe côté notifications — jamais dans l'autre sens.
@Injectable()
export class TrackValidatedListener {
    constructor(private readonly notificationsService: NotificationsService) {}

    @OnEvent(TRACK_VALIDATED_EVENT)
    async handle(event: TrackValidatedEvent): Promise<void> {
        await this.notificationsService.notifyFollowersOfNewRelease(event.artisteId, event.titreId, event.titreNom);
    }
}