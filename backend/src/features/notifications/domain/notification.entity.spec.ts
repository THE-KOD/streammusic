import { Notification } from './notification.entity';
import { ValidationError } from '../../../core/errors';

describe('Notification', () => {
    const baseProps = { id: 'n1', utilisateurId: 'u1', titreId: 't1', type: 'NOUVELLE_SORTIE' as const, dateEnvoi: new Date(), lu: false, message: 'Nouveau titre' };

    it('rejette un message vide', () => {
        expect(() => Notification.create({ ...baseProps, message: '  ' })).toThrow(ValidationError);
    });

    it('marquerCommeLue() passe lu à true', () => {
        const notif = Notification.create(baseProps);
        notif.marquerCommeLue();
        expect(notif.lu).toBe(true);
    });
});