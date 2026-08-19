import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { randomUUID } from 'crypto';

// Correspond exactement à la table `genre` du schéma SQL.
@Entity({ name: 'genre' })
export class GenreOrmEntity {
    @PrimaryColumn({ type: 'char', length: 36 })
    id: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    nom: string;

    // Filet de sécurité si l'id n'est pas fourni avant l'INSERT
    // (le flux normal passe par Genre.create() côté service, qui en génère toujours un).
    @BeforeInsert()
    generateId() {
        if (!this.id) this.id = randomUUID();
    }
}