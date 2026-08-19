import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UtilisateurRepository } from '../domain/user.repository';
import { Utilisateur } from '../domain/user.entity';
import { UtilisateurOrmEntity } from './orm/utilisateur.orm-entity';
import { UtilisateurMapper } from './mappers/utilisateur.mapper';

@Injectable()
export class TypeOrmUtilisateurRepository implements UtilisateurRepository {
    constructor(
        @InjectRepository(UtilisateurOrmEntity)
        private readonly repo: Repository<UtilisateurOrmEntity>,
    ) {}

    async findById(id: string): Promise<Utilisateur | null> {
        const orm = await this.repo.findOne({ where: { id } });
        return orm ? UtilisateurMapper.toDomain(orm) : null;
    }

    async findByEmail(email: string): Promise<Utilisateur | null> {
        const orm = await this.repo.findOne({ where: { email } });
        return orm ? UtilisateurMapper.toDomain(orm) : null;
    }

    async findByPseudo(pseudo: string): Promise<Utilisateur | null> {
        const orm = await this.repo.findOne({ where: { pseudo } });
        return orm ? UtilisateurMapper.toDomain(orm) : null;
    }

    async save(utilisateur: Utilisateur): Promise<Utilisateur> {
        const orm = UtilisateurMapper.toOrm(utilisateur);
        const saved = await this.repo.save(orm);
        return UtilisateurMapper.toDomain(saved);
    }
}
