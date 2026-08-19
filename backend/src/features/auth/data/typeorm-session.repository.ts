import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionRepository } from '../domain/session.repository';
import { Session } from '../domain/session.entity';
import { SessionOrmEntity } from './orm/session.orm-entity';

@Injectable()
export class TypeOrmSessionRepository implements SessionRepository {
    constructor(
        @InjectRepository(SessionOrmEntity)
        private readonly repo: Repository<SessionOrmEntity>,
    ) {}

    async findByRefreshTokenHash(hash: string): Promise<Session | null> {
        const orm = await this.repo.findOne({ where: { refreshTokenHash: hash } });
        return orm ? this.toDomain(orm) : null;
    }

    async save(session: Session): Promise<Session> {
        const orm = new SessionOrmEntity();
        orm.id = session.id;
        orm.utilisateurId = session.utilisateurId;
        orm.refreshTokenHash = session.refreshTokenHash;
        orm.dateCreation = session.dateCreation;
        orm.dateExpiration = session.dateExpiration;
        orm.revoque = session.revoque;
        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }

    async revokeAllForUser(utilisateurId: string): Promise<void> {
        await this.repo.update({ utilisateurId }, { revoque: true });
    }

    private toDomain(orm: SessionOrmEntity): Session {
        return new Session({
            id: orm.id,
            utilisateurId: orm.utilisateurId,
            refreshTokenHash: orm.refreshTokenHash,
            dateCreation: orm.dateCreation,
            dateExpiration: orm.dateExpiration,
            revoque: orm.revoque,
        });
    }
}