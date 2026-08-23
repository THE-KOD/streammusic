import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaylistTrackRepository } from '../domain/playlist-track.repository';
import { PlaylistTrackEntry } from '../domain/reorder-tracks';
import { PlaylistTitreOrmEntity } from './orm/playlist-titre.orm-entity';

@Injectable()
export class TypeOrmPlaylistTrackRepository implements PlaylistTrackRepository {
    constructor(
        @InjectRepository(PlaylistTitreOrmEntity)
        private readonly repo: Repository<PlaylistTitreOrmEntity>,
    ) {}

    async list(playlistId: string): Promise<PlaylistTrackEntry[]> {
        const rows = await this.repo.find({ where: { playlistId }, order: { ordre: 'ASC' } });
        return rows.map((r) => ({ titreId: r.titreId, ordre: r.ordre }));
    }

    async count(playlistId: string): Promise<number> {
        return this.repo.count({ where: { playlistId } });
    }

    async isPresent(playlistId: string, titreId: string): Promise<boolean> {
        const count = await this.repo.count({ where: { playlistId, titreId } });
        return count > 0;
    }

    async getMaxOrdre(playlistId: string): Promise<number> {
        const rows = await this.repo.find({ where: { playlistId }, order: { ordre: 'DESC' }, take: 1 });
        return rows.length > 0 ? rows[0].ordre : 0;
    }

    async add(playlistId: string, titreId: string, ordre: number): Promise<void> {
        const entity = new PlaylistTitreOrmEntity();
        entity.playlistId = playlistId;
        entity.titreId = titreId;
        entity.ordre = ordre;
        entity.dateAjout = new Date();
        await this.repo.save(entity);
    }

    async remove(playlistId: string, titreId: string): Promise<void> {
        await this.repo.delete({ playlistId, titreId });
    }

    async reorderAll(playlistId: string, entries: PlaylistTrackEntry[]): Promise<void> {
        // Une mise à jour par ligne — playlist typique reste petite (quelques
        // dizaines de titres), pas besoin d'optimiser en requête bulk pour l'instant.
        for (const entry of entries) {
            await this.repo.update({ playlistId, titreId: entry.titreId }, { ordre: entry.ordre });
        }
    }
}