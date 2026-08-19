import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'artiste' })
export class ArtisteOrmEntity {
    // PAS de @BeforeInsert() ici, contrairement aux autres entités —
    // cet id n'est JAMAIS un nouvel UUID généré automatiquement : c'est
    // obligatoirement l'id d'un utilisateur déjà existant. C'est le service
    // (voir plus bas) qui l'assigne explicitement, pas la base ni l'ORM.
    @PrimaryColumn({ type: 'char', length: 36 })
    id: string;

    @Column({ type: 'text', nullable: true })
    biographie: string | null;

    @Column({ name: 'photo_artiste_url', type: 'varchar', length: 500, nullable: true })
    photoArtisteUrl: string | null;
}