import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity({ name: 'session' })
export class SessionOrmEntity {
    @PrimaryColumn({ type: 'char', length: 36 })
    id: string;

    @Column({ name: 'utilisateur_id', type: 'char', length: 36 })
    utilisateurId: string;

    @Column({ name: 'refresh_token_hash', type: 'varchar', length: 255 })
    refreshTokenHash: string;

    @Column({ name: 'date_creation', type: 'datetime' })
    dateCreation: Date;

    @Column({ name: 'date_expiration', type: 'datetime' })
    dateExpiration: Date;

    @Column({ type: 'boolean', default: false })
    revoque: boolean;

    @BeforeInsert()
    generateId() {
        if (!this.id) this.id = randomUUID();
    }
}