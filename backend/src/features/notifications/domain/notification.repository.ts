import { Notification } from './notification.entity';

export interface NotificationRepository {
    findById(id: string): Promise<Notification | null>;
    listByUtilisateur(utilisateurId: string, onlyUnread?: boolean): Promise<Notification[]>;
    countUnread(utilisateurId: string): Promise<number>;
    save(notification: Notification): Promise<Notification>;
    markAllAsRead(utilisateurId: string): Promise<void>;
}

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');