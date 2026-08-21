import { Track } from '../../domain/track.entity';
import { TrackOrmEntity } from '../orm/track.orm-entity';

export class TrackMapper {
    // Repasse par Track.create() : une ligne corrompue en base (durée <= 0
    // par exemple, si jamais insérée en dehors de notre application) serait
    // détectée dès le chargement, pas silencieusement acceptée.
    static toDomain(orm: TrackOrmEntity): Track {
        return Track.create({
            id: orm.id,
            albumId: orm.albumId,
            artisteId: orm.artisteId,
            genreId: orm.genreId,
            titre: orm.titre,
            duree: orm.duree,
            fichierAudioUrl: orm.fichierAudioUrl,
            pochetteUrl: orm.pochetteUrl,
            dateSortie: orm.dateSortie,
            nombreEcoutes: orm.nombreEcoutes,
            dateAjout: orm.dateAjout,
            statutModeration: orm.statutModeration,
            moderateurId: orm.moderateurId,
            dateModeration: orm.dateModeration,
        });
    }

    static toOrm(domain: Track): TrackOrmEntity {
        const orm = new TrackOrmEntity();
        orm.id = domain.id;
        orm.albumId = domain.albumId;
        orm.artisteId = domain.artisteId;
        orm.genreId = domain.genreId;
        orm.titre = domain.titre;
        orm.duree = domain.duree;
        orm.fichierAudioUrl = domain.fichierAudioUrl;
        orm.pochetteUrl = domain.pochetteUrl;
        orm.dateSortie = domain.dateSortie;
        orm.nombreEcoutes = domain.nombreEcoutes;
        orm.dateAjout = domain.dateAjout;
        orm.statutModeration = domain.statutModeration;
        orm.moderateurId = domain.moderateurId;
        orm.dateModeration = domain.dateModeration;
        return orm;
    }
}