import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtisteRepository } from '../domain/artiste.repository';
import { Artiste } from '../domain/artiste.entity';
import { ArtisteOrmEntity } from './orm/artiste.orm-entity';
import { ArtisteMapper } from './mappers/artiste.mapper';

@Injectable()
export class TypeOrmArtisteRepository implements ArtisteRepository {
    constructor(
        @InjectRepository(ArtisteOrmEntity)
        private readonly repo: Repository<ArtisteOrmEntity>,
    ) {}

    async findById(id: string): Promise<Artiste | null> {
        const orm = await this.repo.findOne({ where: { id } });
        return orm ? ArtisteMapper.toDomain(orm) : null;
    }

    async existsById(id: string): Promise<boolean> {
        // count() plutôt que findOne() : évite de charger biographie/photo
        // pour une simple vérification d'existence.
        const count = await this.repo.count({ where: { id } });
        return count > 0;
    }

    async findAll(): Promise<Artiste[]> {
        const all = await this.repo.find();
        return all.map(ArtisteMapper.toDomain);
    }

    async save(artiste: Artiste): Promise<Artiste> {
        const saved = await this.repo.save(ArtisteMapper.toOrm(artiste));
        return ArtisteMapper.toDomain(saved);
    }
}