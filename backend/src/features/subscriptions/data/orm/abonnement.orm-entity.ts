import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity({ name: 'abonnement' })
export class AbonnementOrmEntity {
    @PrimaryColumn({ type: 'char', length: 36 })
    id: string;

    @Column({ name: 'utilisateur_id', type: 'char', length: 36, unique: true })
    utilisateurId: string;

    @Column({ type: 'enum', enum: ['GRATUIT', 'PREMIUM'], default: 'GRATUIT' })
    type: 'GRATUIT' | 'PREMIUM';

    @Column({ name: 'date_debut', type: 'date' })
    dateDebut: string;

    @Column({ name: 'date_fin', type: 'date', nullable: true })
    dateFin: string | null;

    @BeforeInsert()
    generateId() {
        if (!this.id) this.id = randomUUID();
    }
}