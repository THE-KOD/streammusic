// Pas de classe Entity ici volontairement — une ligne "favori" ne porte
// qu'un timestamp, aucune règle métier à encapsuler au-delà de son existence.
// L'interface (port) suffit ; data/ fournira l'implémentation MySQL.
export interface FavorisRepository {
    // --- Titres favoris ---
    isTitreFavori(utilisateurId: string, titreId: string): Promise<boolean>;
    addTitreFavori(utilisateurId: string, titreId: string): Promise<void>;
    removeTitreFavori(utilisateurId: string, titreId: string): Promise<void>;
    listTitreIdsFavoris(utilisateurId: string): Promise<string[]>;

    // --- Albums sauvegardés (album_favori dans le schéma) ---
    isAlbumFavori(utilisateurId: string, albumId: string): Promise<boolean>;
    addAlbumFavori(utilisateurId: string, albumId: string): Promise<void>;
    removeAlbumFavori(utilisateurId: string, albumId: string): Promise<void>;
    listAlbumIdsFavoris(utilisateurId: string): Promise<string[]>;
}

export const FAVORIS_REPOSITORY = Symbol('FAVORIS_REPOSITORY');