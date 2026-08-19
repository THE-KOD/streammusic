import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity({ name: 'utilisateur' })
export class UtilisateurOrmEntity {
    @PrimaryColumn({ type: 'char', length: 36 })
    id: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    pseudo: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ name: 'mot_de_passe_hash', type: 'varchar', length: 255, nullable: true })
    motDePasseHash: string | null;

    @Column({ name: 'oauth_provider', type: 'varchar', length: 50, nullable: true })
    oauthProvider: string | null;

    @Column({ name: 'oauth_id', type: 'varchar', length: 255, nullable: true })
    oauthId: string | null;

    @Column({ name: 'photo_profil_url', type: 'varchar', length: 500, nullable: true })
    photoProfilUrl: string | null;

    @Column({ name: 'statut_compte', type: 'enum', enum: ['ACTIF', 'SUSPENDU'], default: 'ACTIF' })
    statutCompte: 'ACTIF' | 'SUSPENDU';

    @Column({ name: 'date_inscription', type: 'datetime' })
    dateInscription: Date;

    // Filet de sécurité redondant avec le trigger MySQL — le flux normal passe
    // par Utilisateur.create() côté domaine, qui exige déjà un id.
    @BeforeInsert()
    generateId() {
        if (!this.id) this.id = randomUUID();
    }
}