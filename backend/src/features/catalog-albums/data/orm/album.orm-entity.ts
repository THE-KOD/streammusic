import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity({ name: 'album' })
export class AlbumOrmEntity {
    @PrimaryColumn({ type: 'char', length: 36 })
    id: string;

    @Column({ name: 'artiste_id', type: 'char', length: 36 })
    artisteId: string;

    @Column({ type: 'varchar', length: 255 })
    titre: string;

    @Column({ name: 'pochette_url', type: 'varchar', length: 500, nullable: true })
    pochetteUrl: string | null;

    // Type TS = string (pas Date) : indique explicitement à TypeORM de ne
    // jamais convertir cette colonne en objet Date, évitant le piège de fuseau
    // horaire déjà expliqué en tête de réponse.
    @Column({ name: 'date_sortie', type: 'date' })
    dateSortie: string;

    @BeforeInsert()
    generateId() {
        if (!this.id) this.id = randomUUID();
    }
}