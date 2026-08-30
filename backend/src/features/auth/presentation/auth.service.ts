import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UTILISATEUR_REPOSITORY, Utilisateur, EmailDejaUtiliseError, PseudoDejaUtiliseError } from '../../users';
import type { UtilisateurRepository } from '../../users';
import { SESSION_REPOSITORY } from '../domain/session.repository';
import type { SessionRepository } from '../domain/session.repository';
import { Session } from '../domain/session.entity';
import { PASSWORD_HASHER } from '../domain/password-hasher';
import type { PasswordHasher } from '../domain/password-hasher';
import { TOKEN_GENERATOR } from '../domain/token-generator';
import type { TokenGenerator } from '../domain/token-generator';
import {
    InvalidCredentialsError,
    CompteSuspenduError,
    SessionInvalideError,
    CompteOAuthSansMotDePasseError, MotDePasseActuelIncorrectError
} from '../domain/errors';
import type { AuthTokens } from '../domain/auth.types';
// Nouveau : abonnement créé automatiquement à l'inscription.
import { ABONNEMENT_REPOSITORY, Abonnement } from '../../subscriptions';
import type { AbonnementRepository } from '../../subscriptions';


@Injectable()
export class AuthService {
    constructor(
        @Inject(UTILISATEUR_REPOSITORY) private readonly utilisateurRepository: UtilisateurRepository,
        @Inject(SESSION_REPOSITORY) private readonly sessionRepository: SessionRepository,
        @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
        @Inject(TOKEN_GENERATOR) private readonly tokenGenerator: TokenGenerator,
        @Inject(ABONNEMENT_REPOSITORY) private readonly abonnementRepository: AbonnementRepository,
    ) {}

    async register(pseudo: string, email: string, motDePasse: string): Promise<{ tokens: AuthTokens; utilisateur: Utilisateur }> {
        if (await this.utilisateurRepository.findByEmail(email)) throw new EmailDejaUtiliseError(email);
        if (await this.utilisateurRepository.findByPseudo(pseudo)) throw new PseudoDejaUtiliseError(pseudo);

        const motDePasseHash = await this.passwordHasher.hash(motDePasse);

        const utilisateur = Utilisateur.create({
            id: randomUUID(),
            pseudo,
            email,
            motDePasseHash,
            oauthProvider: null,
            oauthId: null,
            photoProfilUrl: null,
            statutCompte: 'ACTIF',
            dateInscription: new Date(),
        });

        const saved = await this.utilisateurRepository.save(utilisateur);

        // Création de l'abonnement GRATUIT par défaut — relation 1-1 stricte
        // avec l'utilisateur (voir schéma SQL). Compensation manuelle en cas
        // d'échec : voir l'explication en tête de réponse pour le "pourquoi".
        try {
            const abonnement = Abonnement.create({
                id: randomUUID(),
                utilisateurId: saved.id,
                type: 'GRATUIT',
                dateDebut: new Date().toISOString().slice(0, 10),
                dateFin: null,
            });
            await this.abonnementRepository.save(abonnement);
        } catch (err) {
            // Rien ne doit rester en base si l'abonnement n'a pas pu être créé —
            // on annule la création de l'utilisateur plutôt que de laisser un
            // compte "orphelin" sans abonnement.
            await this.utilisateurRepository.delete(saved.id);
            throw err;
        }

        const tokens = await this.issueSession(saved.id);
        return { tokens, utilisateur: saved };
    }

    async login(email: string, motDePasse: string): Promise<{ tokens: AuthTokens; utilisateur: Utilisateur }> {
        const utilisateur = await this.utilisateurRepository.findByEmail(email);
        if (!utilisateur || !utilisateur.motDePasseHash) throw new InvalidCredentialsError();

        const motDePasseValide = await this.passwordHasher.compare(motDePasse, utilisateur.motDePasseHash);
        if (!motDePasseValide) throw new InvalidCredentialsError();
        if (!utilisateur.estActif) throw new CompteSuspenduError();

        const tokens = await this.issueSession(utilisateur.id);
        return { tokens, utilisateur };
    }

    async refresh(refreshToken: string): Promise<AuthTokens> {
        const decoded = this.tokenGenerator.verifyRefreshToken(refreshToken);
        if (!decoded) throw new SessionInvalideError();

        const hash = this.tokenGenerator.hashRefreshToken(refreshToken);
        const session = await this.sessionRepository.findByRefreshTokenHash(hash);
        if (!session || !session.estValide) throw new SessionInvalideError();

        session.revoquer();
        await this.sessionRepository.save(session);

        return this.issueSession(decoded.sub);
    }

    async logout(utilisateurId: string): Promise<void> {
        await this.sessionRepository.revokeAllForUser(utilisateurId);
    }

    private async issueSession(utilisateurId: string): Promise<AuthTokens> {
        const tokens = this.tokenGenerator.generateTokens(utilisateurId);
        const session = new Session({
            id: randomUUID(),
            utilisateurId,
            refreshTokenHash: this.tokenGenerator.hashRefreshToken(tokens.refreshToken),
            dateCreation: new Date(),
            dateExpiration: this.tokenGenerator.getRefreshTokenExpiration(tokens.refreshToken),
            revoque: false,
        });
        await this.sessionRepository.save(session);
        return tokens;
    }

    async changePassword(utilisateurId: string, currentPassword: string, newPassword: string): Promise<void> {
        const utilisateur = await this.utilisateurRepository.findById(utilisateurId);
        if (!utilisateur || !utilisateur.motDePasseHash) throw new CompteOAuthSansMotDePasseError();

        const valide = await this.passwordHasher.compare(currentPassword, utilisateur.motDePasseHash);
        if (!valide) throw new MotDePasseActuelIncorrectError();

        utilisateur.motDePasseHash = await this.passwordHasher.hash(newPassword);
        await this.utilisateurRepository.save(utilisateur);
    }
}