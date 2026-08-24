import { Suggestion } from './suggestion.entity';

export interface SuggestionRepository {
    listByUtilisateur(utilisateurId: string): Promise<Suggestion[]>;
    // "Dérivée, pas saisie" (modèle métier) : remplace toujours l'ensemble
    // précédent plutôt que de le fusionner — une régénération reflète l'état
    // actuel de l'historique, pas un cumul.
    replaceAllForUtilisateur(utilisateurId: string, suggestions: Suggestion[]): Promise<void>;
}

export const SUGGESTION_REPOSITORY = Symbol('SUGGESTION_REPOSITORY');