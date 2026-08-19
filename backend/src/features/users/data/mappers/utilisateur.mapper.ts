import { Utilisateur } from '../../domain/user.entity';
import { UtilisateurOrmEntity } from '../orm/utilisateur.orm-entity';

export class UtilisateurMapper {
    static toDomain(orm: UtilisateurOrmEntity): Utilisateur {
        return Utilisateur.create({
            id: orm.id,
            pseudo: orm.pseudo,
            email: orm.email,
            motDePasseHash: orm.motDePasseHash,
            oauthProvider: orm.oauthProvider,
            oauthId: orm.oauthId,
            photoProfilUrl: orm.photoProfilUrl,
            statutCompte: orm.statutCompte,
            dateInscription: orm.dateInscription,
        });
    }

    static toOrm(domain: Utilisateur): UtilisateurOrmEntity {
        const orm = new UtilisateurOrmEntity();
        orm.id = domain.id;
        orm.pseudo = domain.pseudo;
        orm.email = domain.email;
        orm.motDePasseHash = domain.motDePasseHash;
        orm.oauthProvider = domain.oauthProvider;
        orm.oauthId = domain.oauthId;
        orm.photoProfilUrl = domain.photoProfilUrl;
        orm.statutCompte = domain.statutCompte;
        orm.dateInscription = domain.dateInscription;
        return orm;
    }
}