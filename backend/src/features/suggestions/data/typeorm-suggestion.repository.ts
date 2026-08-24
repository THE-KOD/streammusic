import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuggestionRepository } from '../domain/suggestion.repository';
import { Suggestion } from '../domain/suggestion.entity';
import { SuggestionOrmEntity } from './orm/suggestion.orm-entity';

@Injectable()
export class TypeOrmSuggestionRepository implements SuggestionRepository {
    constructor(
        @InjectRepository(SuggestionOrmEntity)
        private readonly repo: Repository<SuggestionOrmEntity>,
    ) {}

    async listByUtilisateur(utilisateurId: string): Promise<Suggestion[]> {
        const rows = await this.repo.find({ where: { utilisateurId }, order: { score: 'DESC' } });
        // Number(...) : une colonne DECIMAL revient sous forme de string via
        // mysql2/TypeORM, jamais nativement en number — conversion explicite nécessaire.
        return rows.map((r) =>
            Suggestion.create({ id: r.id, utilisateurId: r.utilisateurId, titreId: r.titreId, score: Number(r.score), dateGeneration: r.dateGeneration }),
        );
    }

    async replaceAllForUtilisateur(utilisateurId: string, suggestions: Suggestion[]): Promise<void> {
        await this.repo.delete({ utilisateurId });
        const ormEntities = suggestions.map((s) => {
            const orm = new SuggestionOrmEntity();
            orm.id = s.id;
            orm.utilisateurId = s.utilisateurId;
            orm.titreId = s.titreId;
            orm.score = s.score;
            orm.dateGeneration = s.dateGeneration;
            return orm;
        });
        if (ormEntities.length > 0) await this.repo.save(ormEntities);
    }
}