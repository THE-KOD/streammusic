import { Album } from '../../domain/album.entity';
import { AlbumOrmEntity } from '../orm/album.orm-entity';

export class AlbumMapper {
    static toDomain(orm: AlbumOrmEntity): Album {
        return Album.create({
            id: orm.id,
            artisteId: orm.artisteId,
            titre: orm.titre,
            pochetteUrl: orm.pochetteUrl,
            dateSortie: orm.dateSortie,
        });
    }

    static toOrm(domain: Album): AlbumOrmEntity {
        const orm = new AlbumOrmEntity();
        orm.id = domain.id;
        orm.artisteId = domain.artisteId;
        orm.titre = domain.titre;
        orm.pochetteUrl = domain.pochetteUrl;
        orm.dateSortie = domain.dateSortie;
        return orm;
    }
}