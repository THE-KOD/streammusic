import { Artiste } from '../../domain/artiste.entity';
import { ArtisteOrmEntity } from '../orm/artiste.orm-entity';

export class ArtisteMapper {
    static toDomain(orm: ArtisteOrmEntity): Artiste {
        return Artiste.create({ id: orm.id, biographie: orm.biographie, photoArtisteUrl: orm.photoArtisteUrl });
    }

    static toOrm(domain: Artiste): ArtisteOrmEntity {
        const orm = new ArtisteOrmEntity();
        orm.id = domain.id;
        orm.biographie = domain.biographie;
        orm.photoArtisteUrl = domain.photoArtisteUrl;
        return orm;
    }
}