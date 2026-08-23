import { Column, Entity, PrimaryColumn } from 'typeorm';

// Clé primaire composite (playlist_id, titre_id) — même pattern que
// favori/album_favori/suivi, pas de colonne id séparée.
@Entity({ name: 'playlist_titre' })
export class PlaylistTitreOrmEntity {
    @PrimaryColumn({ name: 'playlist_id', type: 'char', length: 36 })
    playlistId: string;

    @PrimaryColumn({ name: 'titre_id', type: 'char', length: 36 })
    titreId: string;

    @Column({ type: 'int' })
    ordre: number;

    @Column({ name: 'date_ajout', type: 'datetime' })
    dateAjout: Date;
}