import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackFilters, TrackRepository } from '../domain/track.repository';
import { Track } from '../domain/track.entity';
import { TrackOrmEntity } from './orm/track.orm-entity';
import { TrackMapper } from './mappers/track.mapper';

@Injectable()
export class TypeOrmTrackRepository implements TrackRepository {
    constructor(
        @InjectRepository(TrackOrmEntity)
        private readonly repo: Repository<TrackOrmEntity>,
    ) {}

    async findById(id: string): Promise<Track | null> {
        const orm = await this.repo.findOne({ where: { id } });
        return orm ? TrackMapper.toDomain(orm) : null;
    }

    async findAllValide(filters?: TrackFilters): Promise<Track[]> {
        // On part toujours de statutModeration: 'VALIDE' — jamais contournable
        // par un filtre, c'est la garantie que le catalogue public ne montre
        // jamais un titre en attente ou rejeté.
        const where: Record<string, unknown> = { statutModeration: 'VALIDE' };
        if (filters?.artisteId) where.artisteId = filters.artisteId;
        if (filters?.albumId) where.albumId = filters.albumId;
        if (filters?.genreId) where.genreId = filters.genreId;

        const all = await this.repo.find({ where, order: { dateAjout: 'DESC' } });
        return all.map(TrackMapper.toDomain);
    }

    async findAllByArtiste(artisteId: string): Promise<Track[]> {
        // Volontairement sans filtre de statut : c'est la vue "mes titres",
        // l'artiste doit voir aussi ce qui est encore en attente ou rejeté.
        const all = await this.repo.find({ where: { artisteId }, order: { dateAjout: 'DESC' } });
        return all.map(TrackMapper.toDomain);
    }

    async save(track: Track): Promise<Track> {
        const saved = await this.repo.save(TrackMapper.toOrm(track));
        return TrackMapper.toDomain(saved);
    }

    async delete(id: string): Promise<void> {
        // Pas d'erreur FK à intercepter ici : aucune table ne référence encore
        // titre.id avec RESTRICT (playlists/favoris pas construits) — à revisiter
        // si ça change plus tard dans la Phase 3.
        await this.repo.delete(id);
    }

    async countByArtiste(artisteId: string): Promise<number> {
        // Seuls les titres publiquement visibles comptent — cohérent avec
        // ce qu'un visiteur de la fiche artiste peut réellement voir/écouter.
        return this.repo.count({ where: { artisteId, statutModeration: 'VALIDE' } });
    }
}