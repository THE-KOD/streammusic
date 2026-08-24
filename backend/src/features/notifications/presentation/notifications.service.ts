import { Inject, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NOTIFICATION_REPOSITORY } from '../domain/notification.repository';
import type { NotificationRepository } from '../domain/notification.repository';
import { Notification } from '../domain/notification.entity';
import { NotificationNotFoundError, NotificationForbiddenError } from '../domain/errors';
import { FOLLOWS_REPOSITORY } from '../../follows';
import type { FollowsRepository } from '../../follows';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        @Inject(NOTIFICATION_REPOSITORY) private readonly notificationRepository: NotificationRepository,
        @Inject(FOLLOWS_REPOSITORY) private readonly followsRepository: FollowsRepository,
    ) {}

    listMine(utilisateurId: string, onlyUnread = false): Promise<Notification[]> {
        return this.notificationRepository.listByUtilisateur(utilisateurId, onlyUnread);
    }

    countUnread(utilisateurId: string): Promise<number> {
        return this.notificationRepository.countUnread(utilisateurId);
    }

    async markAsRead(id: string, utilisateurId: string): Promise<Notification> {
        const notification = await this.notificationRepository.findById(id);
        if (!notification) throw new NotificationNotFoundError(id);
        if (notification.utilisateurId !== utilisateurId) throw new NotificationForbiddenError();
        notification.marquerCommeLue();
        return this.notificationRepository.save(notification);
    }

    async markAllAsRead(utilisateurId: string): Promise<void> {
        await this.notificationRepository.markAllAsRead(utilisateurId);
    }

    /**
     * Appelée uniquement par le listener d'événement (voir track-validated.listener.ts) —
     * jamais directement par un controller, puisque c'est une réaction à un événement
     * métier, pas une action déclenchée par une requête HTTP explicite.
     */
    async notifyFollowersOfNewRelease(artisteId: string, titreId: string, titreNom: string): Promise<void> {
        const followerIds = await this.followsRepository.listFollowerIdsOf(artisteId);
        if (followerIds.length === 0) {
            this.logger.log(`Aucun follower pour l'artiste ${artisteId}, aucune notification créée.`);
            return;
        }

        const notifications = followerIds.map((followerId) =>
            Notification.create({
                id: randomUUID(),
                utilisateurId: followerId,
                titreId,
                type: 'NOUVELLE_SORTIE',
                message: `Nouveau titre disponible : "${titreNom}"`,
                dateEnvoi: new Date(),
                lu: false,
            }),
        );

        // Une sauvegarde par notification — même compromis assumé qu'ailleurs
        // (nombre de followers reste petit à cette échelle).
        for (const notification of notifications) {
            await this.notificationRepository.save(notification);
        }
        this.logger.log(`${notifications.length} notification(s) créée(s) pour la sortie de "${titreNom}".`);
    }
}