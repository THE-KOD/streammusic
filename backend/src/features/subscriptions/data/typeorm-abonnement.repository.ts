import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbonnementRepository } from '../domain/abonnement.repository';
import { Abonnement } from '../domain/abonnement.entity';
import { AbonnementOrmEntity } from './orm/abonnement.orm-entity';
import { AbonnementMapper } from './mappers/abonnement.mapper';

@Injectable()
export class TypeOrmAbonnementRepository implements AbonnementRepository {
    constructor(
        @InjectRepository(AbonnementOrmEntity)
        private readonly repo: Repository<AbonnementOrmEntity>,
    ) {}

    async findByUtilisateurId(utilisateurId: string): Promise<Abonnement | null> {
        const orm = await this.repo.findOne({ where: { utilisateurId } });
        return orm ? AbonnementMapper.toDomain(orm) : null;
    }

    async save(abonnement: Abonnement): Promise<Abonnement> {
        const saved = await this.repo.save(AbonnementMapper.toOrm(abonnement));
        return AbonnementMapper.toDomain(saved);
    }
}