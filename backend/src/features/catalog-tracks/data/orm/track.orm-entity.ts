import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { randomUUID } from 'crypto';

@Entity({ name: 'titre' }) // le nom de table reste 'titre' en base, en français
export class TrackOrmEntity {
    @PrimaryColumn({ type: 'char', length: 36 })
    id: string;

    @Column({ name: 'album_id', type: 'char', length: 36, nullable: true })
    albumId: string | null;

    @Column({ name: 'artiste_id', type: 'char', length: 36 })
    artisteId: string;

    @Column({ name: 'genre_id', type: 'char', length: 36 })
    genreId: string;

    @Column({ type: 'varchar', length: 255 })
    titre: string;

    @Column({ type: 'int' })
    duree: number;

    @Column({ name: 'fichier_audio_url', type: 'varchar', length: 500 })
    fichierAudioUrl: string;

    @Column({ name: 'pochette_url', type: 'varchar', length: 500, nullable: true })
    pochetteUrl: string | null;

    @Column({ name: 'date_sortie', type: 'date', nullable: true })
    dateSortie: string | null;

    @Column({ name: 'nombre_ecoutes', type: 'int', default: 0 })
    nombreEcoutes: number;

    @Column({ name: 'date_ajout', type: 'datetime' })
    dateAjout: Date;

    @Column({ name: 'statut_moderation', type: 'enum', enum: ['EN_ATTENTE', 'VALIDE', 'REJETE'], default: 'EN_ATTENTE' })
    statutModeration: 'EN_ATTENTE' | 'VALIDE' | 'REJETE';

    @Column({ name: 'moderateur_id', type: 'char', length: 36, nullable: true })
    moderateurId: string | null;

    @Column({ name: 'date_moderation', type: 'datetime', nullable: true })
    dateModeration: Date | null;

    @BeforeInsert()
    generateId() {
        if (!this.id) this.id = randomUUID();
    }
}