export interface PreferencesRepository {
    listGenreIds(utilisateurId: string): Promise<string[]>;
    // Remplace l'ensemble complet plutôt que de calculer un diff — même
    // principe que replaceAllForUtilisateur() dans suggestions, suffisant
    // à cette échelle et beaucoup plus simple à raisonner.
    replaceGenres(utilisateurId: string, genreIds: string[]): Promise<void>;
}

export const PREFERENCES_REPOSITORY = Symbol('PREFERENCES_REPOSITORY');