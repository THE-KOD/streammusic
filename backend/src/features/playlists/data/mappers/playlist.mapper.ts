import { Playlist } from '../../domain/playlist.entity';
import { PlaylistOrmEntity } from '../orm/playlist.orm-entity';

export class PlaylistMapper {
    static toDomain(orm: PlaylistOrmEntity): Playlist {
        return Playlist.create({
            id: orm.id,
            proprietaireId: orm.proprietaireId,
            nom: orm.nom,
            visibilite: orm.visibilite,
            dateCreation: orm.dateCreation,
        });
    }

    static toOrm(domain: Playlist): PlaylistOrmEntity {
        const orm = new PlaylistOrmEntity();
        orm.id = domain.id;
        orm.proprietaireId = domain.proprietaireId;
        orm.nom = domain.nom;
        orm.visibilite = domain.visibilite;
        orm.dateCreation = domain.dateCreation;
        return orm;
    }
}