import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationRepository } from '../domain/notification.repository';
import { Notification } from '../domain/notification.entity';
import { NotificationOrmEntity } from './orm/notification.orm-entity';
import { NotificationMapper } from './mappers/notification.mapper';

@Injectable()
export class TypeOrmNotificationRepository implements NotificationRepository {
    constructor(
        @InjectRepository(NotificationOrmEntity)
        private readonly repo: Repository<NotificationOrmEntity>,
    ) {}

    async findById(id: string): Promise<Notification | null> {
        const orm = await this.repo.findOne({ where: { id } });
        return orm ? NotificationMapper.toDomain(orm) : null;
    }

    async listByUtilisateur(utilisateurId: string, onlyUnread = false): Promise<Notification[]> {
        const where: Record<string, unknown> = { utilisateurId };
        if (onlyUnread) where.lu = false;
        const rows = await this.repo.find({ where, order: { dateEnvoi: 'DESC' } });
        return rows.map(NotificationMapper.toDomain);
    }

    async countUnread(utilisateurId: string): Promise<number> {
        return this.repo.count({ where: { utilisateurId, lu: false } });
    }

    async save(notification: Notification): Promise<Notification> {
        const saved = await this.repo.save(NotificationMapper.toOrm(notification));
        return NotificationMapper.toDomain(saved);
    }

    async markAllAsRead(utilisateurId: string): Promise<void> {
        await this.repo.update({ utilisateurId, lu: false }, { lu: true });
    }
}