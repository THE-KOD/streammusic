import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'album_favori' })
export class AlbumFavoriOrmEntity {
    @PrimaryColumn({ name: 'utilisateur_id', type: 'char', length: 36 })
    utilisateurId: string;

    @PrimaryColumn({ name: 'album_id', type: 'char', length: 36 })
    albumId: string;

    @Column({ name: 'date_ajout', type: 'datetime' })
    dateAjout: Date;
}