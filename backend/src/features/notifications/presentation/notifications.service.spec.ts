import { NotificationsService } from './notifications.service';
import { NotificationForbiddenError, NotificationNotFoundError } from '../domain/errors';
import { Notification } from '../domain/notification.entity';
import type { NotificationRepository } from '../domain/notification.repository';
import type { FollowsRepository } from '../../follows';

function buildNotif(overrides: Partial<Parameters<typeof Notification.create>[0]> = {}) {
    return Notification.create({ id: 'n1', utilisateurId: 'u1', titreId: 't1', type: 'NOUVELLE_SORTIE', message: 'Test', dateEnvoi: new Date(), lu: false, ...overrides });
}

describe('NotificationsService', () => {
    let notificationRepository: jest.Mocked<NotificationRepository>;
    let followsRepository: jest.Mocked<FollowsRepository>;
    let service: NotificationsService;

    beforeEach(() => {
        notificationRepository = { findById: jest.fn(), listByUtilisateur: jest.fn(), countUnread: jest.fn(), save: jest.fn(), markAllAsRead: jest.fn() };
        followsRepository = { isFollowing: jest.fn(), follow: jest.fn(), unfollow: jest.fn(), listArtisteIdsFollowed: jest.fn(), listFollowerIdsOf: jest.fn() };
        service = new NotificationsService(notificationRepository, followsRepository);
    });

    it("refuse de marquer comme lue la notification d'un autre utilisateur", async () => {
        notificationRepository.findById.mockResolvedValue(buildNotif({ utilisateurId: 'u1' }));
        await expect(service.markAsRead('n1', 'u2')).rejects.toThrow(NotificationForbiddenError);
    });

    it("lève une 404 si la notification n'existe pas", async () => {
        notificationRepository.findById.mockResolvedValue(null);
        await expect(service.markAsRead('inconnu', 'u1')).rejects.toThrow(NotificationNotFoundError);
    });

    it("ne crée aucune notification si l'artiste n'a aucun follower", async () => {
        followsRepository.listFollowerIdsOf.mockResolvedValue([]);
        await service.notifyFollowersOfNewRelease('a1', 't1', 'Titre');
        expect(notificationRepository.save).not.toHaveBeenCalled();
    });

    it('crée une notification par follower', async () => {
        followsRepository.listFollowerIdsOf.mockResolvedValue(['u1', 'u2']);
        notificationRepository.save.mockImplementation(async (n) => n);
        await service.notifyFollowersOfNewRelease('a1', 't1', 'Titre');
        expect(notificationRepository.save).toHaveBeenCalledTimes(2);
    });
});