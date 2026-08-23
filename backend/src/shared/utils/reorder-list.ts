// Fonction pure, sans dépendance à un repository ou une base de données —
// utilisée par playlists ET queue, qui partagent le même besoin de
// réordonnancement d'une liste ordonnée par un champ "ordre".
export interface OrderedEntry {
    id: string;
    ordre: number;
}

export function reorderList(entries: OrderedEntry[], id: string, versPosition: number): OrderedEntry[] {
    const ids = entries.map((e) => e.id);
    const fromIndex = ids.indexOf(id);
    if (fromIndex === -1) {
        // Filet de sécurité : le service appelant doit toujours vérifier la
        // présence de l'élément AVANT d'appeler cette fonction.
        throw new Error(`L'élément ${id} n'appartient pas à cette liste.`);
    }

    const clampedPosition = Math.max(0, Math.min(versPosition, ids.length - 1));
    const reorderedIds = [...ids];
    const [moved] = reorderedIds.splice(fromIndex, 1);
    reorderedIds.splice(clampedPosition, 0, moved);

    // Renumérotation complète 1, 2, 3... — plus robuste que des positions
    // fractionnaires, jamais de trou dans la séquence.
    return reorderedIds.map((entryId, index) => ({ id: entryId, ordre: index + 1 }));
}