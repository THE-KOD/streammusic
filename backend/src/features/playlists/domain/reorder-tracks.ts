export interface PlaylistTrackEntry {
    titreId: string;
    ordre: number;
}

/**
 * Fonction pure de réordonnancement — même esprit que queue-logic.ts côté
 * frontend (player). Prend l'état actuel + le titre à déplacer + sa nouvelle
 * position (index 0-based), retourne le nouvel ordre complet à persister.
 * Aucune dépendance à la base de données : testable isolément.
 */
export function reorderTracks(
    entries: PlaylistTrackEntry[], // doit déjà être trié par ordre croissant
    titreId: string,
    versPosition: number,
): PlaylistTrackEntry[] {
    const ids = entries.map((e) => e.titreId);
    const fromIndex = ids.indexOf(titreId);
    if (fromIndex === -1) {
        // Le service appelant doit vérifier la présence du titre AVANT d'appeler
        // cette fonction (voir TitreAbsentDePlaylistError) — ce cas ne devrait
        // jamais se produire en pratique, filet de sécurité uniquement.
        throw new Error(`Le titre ${titreId} n'appartient pas à cette liste.`);
    }

    const clampedPosition = Math.max(0, Math.min(versPosition, ids.length - 1));
    const reordered = [...ids];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(clampedPosition, 0, moved);

    // Renumérotation complète en 1, 2, 3... — plus simple et plus robuste
    // que de calculer des positions fractionnaires ou de ne renuméroter
    // que les éléments "entre" l'ancienne et la nouvelle position.
    return reordered.map((id, index) => ({ titreId: id, ordre: index + 1 }));
}