import { Session } from './session.entity';

export interface SessionRepository {
    findByRefreshTokenHash(hash: string): Promise<Session | null>;
    save(session: Session): Promise<Session>;
    revokeAllForUser(utilisateurId: string): Promise<void>;
}

export const SESSION_REPOSITORY = Symbol('SESSION_REPOSITORY');