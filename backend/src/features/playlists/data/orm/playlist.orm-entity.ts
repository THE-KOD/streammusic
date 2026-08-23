import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity({ name: 'playlist' })
export class PlaylistOrmEntity {
    @PrimaryColumn({ type: 'char', length: 36 })
    id: string;

    @Column({ name: 'proprietaire_id', type: 'char', length: 36 })
    proprietaireId: string;

    @Column({ type: 'varchar', length: 100 })
    nom: string;

    @Column({ type: 'enum', enum: ['PUBLIQUE', 'PRIVEE'], default: 'PRIVEE' })
    visibilite: 'PUBLIQUE' | 'PRIVEE';

    @Column({ name: 'date_creation', type: 'datetime' })
    dateCreation: Date;

    @BeforeInsert()
    generateId() {
        if (!this.id) this.id = randomUUID();
    }
}