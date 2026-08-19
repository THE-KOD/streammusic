import { Session } from './session.entity';

describe('Session', () => {
    const baseProps = {
        id: 's1',
        utilisateurId: 'u1',
        refreshTokenHash: 'hash',
        dateCreation: new Date(),
        revoque: false,
    };

    it('est valide si non révoquée et non expirée', () => {
        const session = new Session({ ...baseProps, dateExpiration: new Date(Date.now() + 10_000) });
        expect(session.estValide).toBe(true);
    });

    it("n'est plus valide après expiration", () => {
        const session = new Session({ ...baseProps, dateExpiration: new Date(Date.now() - 10_000) });
        expect(session.estValide).toBe(false);
    });

    it("n'est plus valide après révocation", () => {
        const session = new Session({ ...baseProps, dateExpiration: new Date(Date.now() + 10_000) });
        session.revoquer();
        expect(session.estValide).toBe(false);
    });
});