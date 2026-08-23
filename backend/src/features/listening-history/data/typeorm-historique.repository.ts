import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoriqueRepository } from '../domain/historique.repository';
import { HistoriqueEcoute } from '../domain/historique-ecoute.entity';
import { HistoriqueEcouteOrmEntity } from './orm/historique-ecoute.orm-entity';

@Injectable()
export class TypeOrmHistoriqueRepository implements HistoriqueRepository {
    constructor(
        @InjectRepository(HistoriqueEcouteOrmEntity)
        private readonly repo: Repository<HistoriqueEcouteOrmEntity>,
    ) {}

    async save(entry: HistoriqueEcoute): Promise<HistoriqueEcoute> {
        const orm = new HistoriqueEcouteOrmEntity();
        orm.id = entry.id;
        orm.utilisateurId = entry.utilisateurId;
        orm.titreId = entry.titreId;
        orm.dateEcoute = entry.dateEcoute;
        orm.dureeEcoutee = entry.dureeEcoutee;
        const saved = await this.repo.save(orm);
        // reconstruct() ici, jamais create() — voir note en tête de réponse.
        return HistoriqueEcoute.reconstruct({
            id: saved.id, utilisateurId: saved.utilisateurId, titreId: saved.titreId,
            dateEcoute: saved.dateEcoute, dureeEcoutee: saved.dureeEcoutee,
        });
    }

    async listByUtilisateur(utilisateurId: string, limit: number): Promise<HistoriqueEcoute[]> {
        const rows = await this.repo.find({ where: { utilisateurId }, order: { dateEcoute: 'DESC' }, take: limit });
        return rows.map((r) => HistoriqueEcoute.reconstruct({
            id: r.id, utilisateurId: r.utilisateurId, titreId: r.titreId, dateEcoute: r.dateEcoute, dureeEcoutee: r.dureeEcoutee,
        }));
    }

    async clearForUtilisateur(utilisateurId: string): Promise<void> {
        await this.repo.delete({ utilisateurId });
    }
}