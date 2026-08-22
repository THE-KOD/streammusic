import { Abonnement } from '../../domain/abonnement.entity';
import { AbonnementOrmEntity } from '../orm/abonnement.orm-entity';

export class AbonnementMapper {
    static toDomain(orm: AbonnementOrmEntity): Abonnement {
        return Abonnement.create({
            id: orm.id,
            utilisateurId: orm.utilisateurId,
            type: orm.type,
            dateDebut: orm.dateDebut,
            dateFin: orm.dateFin,
        });
    }

    static toOrm(domain: Abonnement): AbonnementOrmEntity {
        const orm = new AbonnementOrmEntity();
        orm.id = domain.id;
        orm.utilisateurId = domain.utilisateurId;
        orm.type = domain.type;
        orm.dateDebut = domain.dateDebut;
        orm.dateFin = domain.dateFin;
        return orm;
    }
}