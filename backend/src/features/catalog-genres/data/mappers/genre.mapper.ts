import { Genre } from '../../domain/genre.entity';
import { GenreOrmEntity } from '../orm/genre.orm-entity';

export class GenreMapper {
    // Une ligne de la base -> un objet Genre du domaine (repasse par create(),
    // donc revalide au passage — une ligne corrompue en base serait détectée ici).
    static toDomain(orm: GenreOrmEntity): Genre {
        return Genre.create({ id: orm.id, nom: orm.nom });
    }

    // L'inverse : objet du domaine -> ligne prête à être sauvegardée.
    static toOrm(domain: Genre): GenreOrmEntity {
        const orm = new GenreOrmEntity();
        orm.id = domain.id;
        orm.nom = domain.nom;
        return orm;
    }
}