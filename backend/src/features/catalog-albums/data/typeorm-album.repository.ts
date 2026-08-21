import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumRepository } from '../domain/album.repository';
import { Album } from '../domain/album.entity';
import { AlbumOrmEntity } from './orm/album.orm-entity';
import { AlbumMapper } from './mappers/album.mapper';

@Injectable()
export class TypeOrmAlbumRepository implements AlbumRepository {
    constructor(
        @InjectRepository(AlbumOrmEntity)
        private readonly repo: Repository<AlbumOrmEntity>,
    ) {}

    async findById(id: string): Promise<Album | null> {
        const orm = await this.repo.findOne({ where: { id } });
        return orm ? AlbumMapper.toDomain(orm) : null;
    }

    async existsById(id: string): Promise<boolean> {
        const count = await this.repo.count({ where: { id } });
        return count > 0;
    }

    async findAll(): Promise<Album[]> {
        // Les plus récents d'abord — plus utile qu'un ordre d'insertion arbitraire
        const all = await this.repo.find({ order: { dateSortie: 'DESC' } });
        return all.map(AlbumMapper.toDomain);
    }

    async findByArtisteId(artisteId: string): Promise<Album[]> {
        const all = await this.repo.find({ where: { artisteId }, order: { dateSortie: 'DESC' } });
        return all.map(AlbumMapper.toDomain);
    }

    async save(album: Album): Promise<Album> {
        const saved = await this.repo.save(AlbumMapper.toOrm(album));
        return AlbumMapper.toDomain(saved);
    }

    async delete(id: string): Promise<void> {
        // Contrairement à catalog-genres, pas besoin d'intercepter d'erreur FK :
        // titre.album_id est en ON DELETE SET NULL dans le schéma (pas RESTRICT).
        // Supprimer un album ne peut jamais échouer à cause de ses titres —
        // ils deviennent simplement des singles, comportement déjà voulu.
        await this.repo.delete(id);
    }
}