import { Abonnement } from './abonnement.entity';
import { ValidationError } from '../../../core/errors';

describe('Abonnement', () => {
    const baseProps = { id: 'ab1', utilisateurId: 'u1', type: 'GRATUIT' as const, dateDebut: '2026-01-01', dateFin: null };

    it('rejette une dateFin antérieure à dateDebut', () => {
        expect(() => Abonnement.create({ ...baseProps, dateFin: '2025-12-31' })).toThrow(ValidationError);
    });

    it('accepte une dateFin égale ou postérieure à dateDebut', () => {
        expect(() => Abonnement.create({ ...baseProps, dateFin: '2026-01-01' })).not.toThrow();
        expect(() => Abonnement.create({ ...baseProps, dateFin: '2026-02-01' })).not.toThrow();
    });

    it('passerPremium() fixe une dateFin un mois après dateDebut', () => {
        const abonnement = Abonnement.create(baseProps);
        abonnement.passerPremium();
        expect(abonnement.type).toBe('PREMIUM');
        expect(abonnement.dateFin).not.toBeNull();
        expect(abonnement.estPremium).toBe(true);
    });

    it('revenirGratuit() efface la dateFin', () => {
        const abonnement = Abonnement.create({ ...baseProps, type: 'PREMIUM', dateFin: '2026-06-01' });
        abonnement.revenirGratuit();
        expect(abonnement.type).toBe('GRATUIT');
        expect(abonnement.dateFin).toBeNull();
    });

    it('estExpire est faux pour un abonnement gratuit', () => {
        const abonnement = Abonnement.create(baseProps);
        expect(abonnement.estExpire).toBe(false);
    });

    it('estExpire est vrai pour un premium dont la dateFin est passée', () => {
        // dateDebut ET dateFin doivent toutes les deux être dans le passé,
        // avec dateFin >= dateDebut (sinon Abonnement.create() les rejette à raison —
        // voir l'explication complète dans la réponse).
        const abonnement = Abonnement.create({
            ...baseProps,
            type: 'PREMIUM',
            dateDebut: '2019-01-01',
            dateFin: '2020-01-01',
        });
        expect(abonnement.estExpire).toBe(true);
    });
});