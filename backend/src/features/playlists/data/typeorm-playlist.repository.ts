import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaylistRepository } from '../domain/playlist.repository';
import { Playlist } from '../domain/playlist.entity';
import { PlaylistOrmEntity } from './orm/playlist.orm-entity';
import { PlaylistMapper } from './mappers/playlist.mapper';

@Injectable()
export class TypeOrmPlaylistRepository implements PlaylistRepository {
    constructor(
        @InjectRepository(PlaylistOrmEntity)
        private readonly repo: Repository<PlaylistOrmEntity>,
    ) {}

    async findById(id: string): Promise<Playlist | null> {
        const orm = await this.repo.findOne({ where: { id } });
        return orm ? PlaylistMapper.toDomain(orm) : null;
    }

    async findByProprietaire(proprietaireId: string): Promise<Playlist[]> {
        const all = await this.repo.find({ where: { proprietaireId }, order: { dateCreation: 'DESC' } });
        return all.map(PlaylistMapper.toDomain);
    }

    async save(playlist: Playlist): Promise<Playlist> {
        const saved = await this.repo.save(PlaylistMapper.toOrm(playlist));
        return PlaylistMapper.toDomain(saved);
    }

    async delete(id: string): Promise<void> {
        // Pas d'erreur FK à intercepter : playlist_titre référence playlist_id
        // en ON DELETE CASCADE dans le schéma — les lignes de jointure disparaissent
        // automatiquement, pas besoin de les supprimer manuellement avant.
        await this.repo.delete(id);
    }
}