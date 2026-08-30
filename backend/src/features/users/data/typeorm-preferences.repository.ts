import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreferencesRepository } from '../domain/preferences.repository';
import { UtilisateurGenrePrefereOrmEntity } from './orm/utilisateur-genre-prefere.orm-entity';

@Injectable()
export class TypeOrmPreferencesRepository implements PreferencesRepository {
    constructor(
        @InjectRepository(UtilisateurGenrePrefereOrmEntity)
        private readonly repo: Repository<UtilisateurGenrePrefereOrmEntity>,
    ) {}

    async listGenreIds(utilisateurId: string): Promise<string[]> {
        const rows = await this.repo.find({ where: { utilisateurId } });
        return rows.map((r) => r.genreId);
    }

    async replaceGenres(utilisateurId: string, genreIds: string[]): Promise<void> {
        await this.repo.delete({ utilisateurId });
        if (genreIds.length === 0) return;
        const rows = genreIds.map((genreId) => {
            const entity = new UtilisateurGenrePrefereOrmEntity();
            entity.utilisateurId = utilisateurId;
            entity.genreId = genreId;
            return entity;
        });
        await this.repo.save(rows);
    }
}