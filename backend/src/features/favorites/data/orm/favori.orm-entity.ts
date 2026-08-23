import { Column, Entity, PrimaryColumn } from 'typeorm';

// Correspond à la table `favori` — clé primaire COMPOSITE (pas de colonne
// `id` séparée), donc deux @PrimaryColumn plutôt qu'un unique @PrimaryColumn + @BeforeInsert.
@Entity({ name: 'favori' })
export class FavoriOrmEntity {
    @PrimaryColumn({ name: 'utilisateur_id', type: 'char', length: 36 })
    utilisateurId: string;

    @PrimaryColumn({ name: 'titre_id', type: 'char', length: 36 })
    titreId: string;

    @Column({ name: 'date_ajout', type: 'datetime' })
    dateAjout: Date;
}