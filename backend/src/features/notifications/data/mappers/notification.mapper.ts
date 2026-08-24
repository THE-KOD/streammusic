import { Notification } from '../../domain/notification.entity';
import { NotificationOrmEntity } from '../orm/notification.orm-entity';

export class NotificationMapper {
    static toDomain(orm: NotificationOrmEntity): Notification {
        return Notification.create({
            id: orm.id, utilisateurId: orm.utilisateurId, titreId: orm.titreId,
            type: orm.type, message: orm.message, dateEnvoi: orm.dateEnvoi, lu: orm.lu,
        });
    }

    static toOrm(domain: Notification): NotificationOrmEntity {
        const orm = new NotificationOrmEntity();
        orm.id = domain.id;
        orm.utilisateurId = domain.utilisateurId;
        orm.titreId = domain.titreId;
        orm.type = domain.type;
        orm.message = domain.message;
        orm.dateEnvoi = domain.dateEnvoi;
        orm.lu = domain.lu;
        return orm;
    }
}