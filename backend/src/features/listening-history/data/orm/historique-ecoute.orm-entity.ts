import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity({ name: 'historique_ecoute' })
export class HistoriqueEcouteOrmEntity {
    @PrimaryColumn({ type: 'char', length: 36 })
    id: string;

    @Column({ name: 'utilisateur_id', type: 'char', length: 36 })
    utilisateurId: string;

    @Column({ name: 'titre_id', type: 'char', length: 36 })
    titreId: string;

    @Column({ name: 'date_ecoute', type: 'datetime' })
    dateEcoute: Date;

    @Column({ name: 'duree_ecoutee', type: 'int' })
    dureeEcoutee: number;

    @BeforeInsert()
    generateId() {
        if (!this.id) this.id = randomUUID();
    }
}