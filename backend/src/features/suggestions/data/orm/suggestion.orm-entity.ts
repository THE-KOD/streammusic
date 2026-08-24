import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity({ name: 'suggestion' })
export class SuggestionOrmEntity {
    @PrimaryColumn({ type: 'char', length: 36 })
    id: string;

    @Column({ name: 'utilisateur_id', type: 'char', length: 36 })
    utilisateurId: string;

    @Column({ name: 'titre_id', type: 'char', length: 36 })
    titreId: string;

    @Column({ type: 'decimal', precision: 5, scale: 4 })
    score: number;

    @Column({ name: 'date_generation', type: 'datetime' })
    dateGeneration: Date;

    @BeforeInsert()
    generateId() {
        if (!this.id) this.id = randomUUID();
    }
}