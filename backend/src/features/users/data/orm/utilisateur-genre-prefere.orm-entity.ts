import { Column, Entity, PrimaryColumn } from 'typeorm';

// Correspond exactement à utilisateur_genre_prefere du schéma — clé
// primaire composite, aucune colonne additionnelle (contrairement à
// favori/suivi qui ont un date_ajout, celle-ci n'en a pas).
@Entity({ name: 'utilisateur_genre_prefere' })
export class UtilisateurGenrePrefereOrmEntity {
    @PrimaryColumn({ name: 'utilisateur_id', type: 'char', length: 36 })
    utilisateurId: string;

    @PrimaryColumn({ name: 'genre_id', type: 'char', length: 36 })
    genreId: string;
}