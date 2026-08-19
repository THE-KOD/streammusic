import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenreRepository } from '../domain/genre.repository';
import { Genre } from '../domain/genre.entity';
import { GenreOrmEntity } from './orm/genre.orm-entity';
import { GenreMapper } from './mappers/genre.mapper';
import { GenreEnUsageError } from '../domain/errors';

@Injectable()
export class TypeOrmGenreRepository implements GenreRepository {
    constructor(
        @InjectRepository(GenreOrmEntity)
        private readonly repo: Repository<GenreOrmEntity>,
    ) {}

    async findAll(): Promise<Genre[]> {
        // Tri alphabétique : plus agréable à afficher qu'un ordre d'insertion arbitraire.
        const all = await this.repo.find({ order: { nom: 'ASC' } });
        return all.map(GenreMapper.toDomain);
    }

    async findById(id: string): Promise<Genre | null> {
        const orm = await this.repo.findOne({ where: { id } });
        return orm ? GenreMapper.toDomain(orm) : null;
    }

    async findByNom(nom: string): Promise<Genre | null> {
        const orm = await this.repo.findOne({ where: { nom } });
        return orm ? GenreMapper.toDomain(orm) : null;
    }

    async save(genre: Genre): Promise<Genre> {
        const saved = await this.repo.save(GenreMapper.toOrm(genre));
        return GenreMapper.toDomain(saved);
    }

    async delete(id: string): Promise<void> {
        try {
            await this.repo.delete(id);
        } catch (err) {
            // Code d'erreur MySQL 1451 = suppression refusée par une contrainte de clé
            // étrangère (ici : ON DELETE RESTRICT sur titre.genre_id dans le schéma SQL).
            // On transforme cette erreur technique en erreur métier compréhensible,
            // plutôt que de laisser fuiter un message MySQL brut jusqu'au client.
            const errno = (err as any)?.driverError?.errno ?? (err as any)?.errno;
            if (errno === 1451) {
                throw new GenreEnUsageError(id);
            }
            throw err; // toute autre erreur remonte telle quelle (bug réel à investiguer)
        }
    }
}