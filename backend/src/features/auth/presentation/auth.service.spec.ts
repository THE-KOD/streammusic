import { AuthService } from './auth.service';
import {Utilisateur, UtilisateurRepository} from '../../users';
import type { SessionRepository } from '../domain/session.repository';
import type { PasswordHasher } from '../domain/password-hasher';
import type { TokenGenerator } from '../domain/token-generator';
import type { AbonnementRepository } from '../../subscriptions';

function buildMocks() {
    const utilisateurRepository: jest.Mocked<UtilisateurRepository> = {
        findById: jest.fn(), findByEmail: jest.fn(), findByPseudo: jest.fn(), save: jest.fn(), delete: jest.fn(),
    };
    const sessionRepository: jest.Mocked<SessionRepository> = {
        findByRefreshTokenHash: jest.fn(), save: jest.fn(), revokeAllForUser: jest.fn(),
    };
    const passwordHasher: jest.Mocked<PasswordHasher> = { hash: jest.fn(), compare: jest.fn() };
    const tokenGenerator: jest.Mocked<TokenGenerator> = {
        generateTokens: jest.fn(), verifyAccessToken: jest.fn(), verifyRefreshToken: jest.fn(),
        hashRefreshToken: jest.fn(), getRefreshTokenExpiration: jest.fn(),
    };
    const abonnementRepository: jest.Mocked<AbonnementRepository> = { findByUtilisateurId: jest.fn(), save: jest.fn() };
    return { utilisateurRepository, sessionRepository, passwordHasher, tokenGenerator, abonnementRepository };
}

describe("AuthService — creation de l'abonnement a l'inscription", () => {
    it("supprime l'utilisateur si la creation de l'abonnement echoue (compensation)", async () => {
        const mocks = buildMocks();
        mocks.utilisateurRepository.findByEmail.mockResolvedValue(null);
        mocks.utilisateurRepository.findByPseudo.mockResolvedValue(null);
        mocks.passwordHasher.hash.mockResolvedValue('hash');
        mocks.utilisateurRepository.save.mockImplementation(async (u) => u);
        mocks.abonnementRepository.save.mockRejectedValue(new Error('DB indisponible'));

        const service = new AuthService(
            mocks.utilisateurRepository,
            mocks.sessionRepository,
            mocks.passwordHasher,
            mocks.tokenGenerator,
            mocks.abonnementRepository,
        );

        await expect(service.register('jane', 'jane@example.com', 'motdepasse123')).rejects.toThrow('DB indisponible');
        expect(mocks.utilisateurRepository.delete).toHaveBeenCalled();
    });

    it("cree normalement l'utilisateur et son abonnement quand tout reussit", async () => {
        const mocks = buildMocks();
        mocks.utilisateurRepository.findByEmail.mockResolvedValue(null);
        mocks.utilisateurRepository.findByPseudo.mockResolvedValue(null);
        mocks.passwordHasher.hash.mockResolvedValue('hash');
        mocks.utilisateurRepository.save.mockImplementation(async (u) => u);
        mocks.abonnementRepository.save.mockImplementation(async (a) => a);
        mocks.tokenGenerator.generateTokens.mockReturnValue({ accessToken: 'a', refreshToken: 'r' });
        mocks.tokenGenerator.hashRefreshToken.mockReturnValue('hash-r');
        mocks.tokenGenerator.getRefreshTokenExpiration.mockReturnValue(new Date());
        mocks.sessionRepository.save.mockImplementation(async (s) => s);

        const service = new AuthService(
            mocks.utilisateurRepository,
            mocks.sessionRepository,
            mocks.passwordHasher,
            mocks.tokenGenerator,
            mocks.abonnementRepository,
        );

        await service.register('jane', 'jane@example.com', 'motdepasse123');

        expect(mocks.abonnementRepository.save).toHaveBeenCalled();
        expect(mocks.utilisateurRepository.delete).not.toHaveBeenCalled();
    });

    describe('AuthService — changePassword', () => {
        it('refuse un mot de passe actuel incorrect', async () => {
            const mocks = buildMocks();
            mocks.utilisateurRepository.findById.mockResolvedValue(
                Utilisateur.create({ id: 'u1', pseudo: 'jane', email: 'j@x.com', motDePasseHash: 'hash-existant', oauthProvider: null, oauthId: null, photoProfilUrl: null, statutCompte: 'ACTIF', dateInscription: new Date() }),
            );
            mocks.passwordHasher.compare.mockResolvedValue(false);
            const service = new AuthService(mocks.utilisateurRepository, mocks.sessionRepository, mocks.passwordHasher, mocks.tokenGenerator, mocks.abonnementRepository);
            await expect(service.changePassword('u1', 'mauvais', 'nouveauMotDePasse123')).rejects.toThrow();
        });

        it('change le mot de passe si le mot de passe actuel est correct', async () => {
            const mocks = buildMocks();
            mocks.utilisateurRepository.findById.mockResolvedValue(
                Utilisateur.create({ id: 'u1', pseudo: 'jane', email: 'j@x.com', motDePasseHash: 'hash-existant', oauthProvider: null, oauthId: null, photoProfilUrl: null, statutCompte: 'ACTIF', dateInscription: new Date() }),
            );
            mocks.passwordHasher.compare.mockResolvedValue(true);
            mocks.passwordHasher.hash.mockResolvedValue('nouveau-hash');
            mocks.utilisateurRepository.save.mockImplementation(async (u) => u);
            const service = new AuthService(mocks.utilisateurRepository, mocks.sessionRepository, mocks.passwordHasher, mocks.tokenGenerator, mocks.abonnementRepository);
            await service.changePassword('u1', 'bon-mot-de-passe', 'nouveauMotDePasse123');
            expect(mocks.utilisateurRepository.save).toHaveBeenCalledWith(expect.objectContaining({ motDePasseHash: 'nouveau-hash' }));
        });
    });
});