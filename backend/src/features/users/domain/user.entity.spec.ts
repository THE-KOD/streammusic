import { Utilisateur } from './user.entity';
import { ValidationError } from '../../../core/errors';

describe('Utilisateur', () => {
    const baseProps = {
        id: 'u1',
        pseudo: 'jane',
        email: 'jane@example.com',
        motDePasseHash: null,
        oauthProvider: null,
        oauthId: null,
        photoProfilUrl: null,
        statutCompte: 'ACTIF' as const,
        dateInscription: new Date(),
    };

    it('rejette un utilisateur sans mot de passe ni OAuth', () => {
        expect(() => Utilisateur.create({ ...baseProps })).toThrow(ValidationError);
    });

    it('accepte un utilisateur avec mot de passe', () => {
        const user = Utilisateur.create({ ...baseProps, motDePasseHash: 'hash' });
        expect(user.peutSeConnecterParMotDePasse).toBe(true);
    });

    it('rejette oauthProvider sans oauthId', () => {
        expect(() => Utilisateur.create({ ...baseProps, oauthProvider: 'google' })).toThrow(ValidationError);
    });

    it('accepte une identité OAuth complète', () => {
        const user = Utilisateur.create({ ...baseProps, oauthProvider: 'google', oauthId: 'g-123' });
        expect(user.estConnecteViaOAuth).toBe(true);
    });

    it('suspendre() change le statut', () => {
        const user = Utilisateur.create({ ...baseProps, motDePasseHash: 'hash' });
        user.suspendre();
        expect(user.estActif).toBe(false);
    });
});