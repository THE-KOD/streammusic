import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowsRepository } from '../domain/follows.repository';
import { SuiviOrmEntity } from './orm/suivi.orm-entity';

@Injectable()
export class TypeOrmFollowsRepository implements FollowsRepository {
    constructor(
        @InjectRepository(SuiviOrmEntity)
        private readonly repo: Repository<SuiviOrmEntity>,
    ) {}

    async isFollowing(followerId: string, artisteId: string): Promise<boolean> {
        const count = await this.repo.count({ where: { followerId, artisteId } });
        return count > 0;
    }

    async follow(followerId: string, artisteId: string): Promise<void> {
        if (await this.isFollowing(followerId, artisteId)) return; // idempotent
        const entity = new SuiviOrmEntity();
        entity.followerId = followerId;
        entity.artisteId = artisteId;
        entity.dateSuivi = new Date();
        await this.repo.save(entity);
    }

    async unfollow(followerId: string, artisteId: string): Promise<void> {
        await this.repo.delete({ followerId, artisteId });
    }

    async listArtisteIdsFollowed(followerId: string): Promise<string[]> {
        const rows = await this.repo.find({ where: { followerId }, order: { dateSuivi: 'DESC' } });
        return rows.map((r) => r.artisteId);
    }
}