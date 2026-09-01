import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowsModule } from '../follows/follows.module';
import { NotificationOrmEntity } from './data/orm/notification.orm-entity';
import { TypeOrmNotificationRepository } from './data/typeorm-notification.repository';
import { NOTIFICATION_REPOSITORY } from './domain/notification.repository';
import { NotificationsService } from './presentation/notifications.service';
import { NotificationsController } from './presentation/notifications.controller';
import { TrackValidatedListener } from './presentation/listeners/track-validated.listener';
import {TracksModule} from "../catalog-tracks/catalog-tracks.module";

@Module({
    // FollowsModule importé pour savoir qui notifier ; catalog-tracks n'est PAS
    // importé ici — le découplage passe par l'événement (voir le listener).
    imports: [FollowsModule, TracksModule, TypeOrmModule.forFeature([NotificationOrmEntity])],
    controllers: [NotificationsController],
    providers: [
        { provide: NOTIFICATION_REPOSITORY, useClass: TypeOrmNotificationRepository },
        NotificationsService,
        TrackValidatedListener,
    ],
})
export class NotificationsModule {}