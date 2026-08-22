import { SubscriptionsService } from './subscriptions.service';
import { Abonnement } from '../domain/abonnement.entity';
import { AbonnementNotFoundError } from '../domain/errors';
import type { AbonnementRepository } from '../domain/abonnement.repository';

describe('SubscriptionsService', () => {
    let repository: jest.Mocked<AbonnementRepository>;
    let service: SubscriptionsService;

    beforeEach(() => {
        repository = { findByUtilisateurId: jest.fn(), save: jest.fn() };
        service = new SubscriptionsService(repository);
    });

    it('getMine() lève une erreur si aucun abonnement trouvé', async () => {
        repository.findByUtilisateurId.mockResolvedValue(null);
        await expect(service.getMine('u1')).rejects.toThrow(AbonnementNotFoundError);
    });

    it('upgradeToPremium() persiste le changement de type', async () => {
        const abonnement = Abonnement.create({ id: 'ab1', utilisateurId: 'u1', type: 'GRATUIT', dateDebut: '2026-01-01', dateFin: null });
        repository.findByUtilisateurId.mockResolvedValue(abonnement);
        repository.save.mockImplementation(async (a) => a);

        const result = await service.upgradeToPremium('u1');
        expect(result.type).toBe('PREMIUM');
    });
});