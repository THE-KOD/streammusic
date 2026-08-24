import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity({ name: 'notification' })
export class NotificationOrmEntity {
    @PrimaryColumn({ type: 'char', length: 36 })
    id: string;

    @Column({ name: 'utilisateur_id', type: 'char', length: 36 })
    utilisateurId: string;

    @Column({ name: 'titre_id', type: 'char', length: 36, nullable: true })
    titreId: string | null;

    @Column({ type: 'enum', enum: ['NOUVELLE_SORTIE', 'SYSTEME'] })
    type: 'NOUVELLE_SORTIE' | 'SYSTEME';

    @Column({ type: 'varchar', length: 500 })
    message: string;

    @Column({ name: 'date_envoi', type: 'datetime' })
    dateEnvoi: Date;

    @Column({ type: 'boolean', default: false })
    lu: boolean;

    @BeforeInsert()
    generateId() {
        if (!this.id) this.id = randomUUID();
    }
}