// Garde le PREMIER élément rencontré pour chaque id, retire les suivants.
// Défense générique contre les doublons — quelle que soit leur origine
// (état React qui se chevauche, réponse API imparfaite, etc.) — plutôt
// que de dépendre uniquement de la garantie d'unicité du backend.
export function dedupeById<T extends { id: string }>(items: T[]): T[] {
    const seen = new Set<string>()
    return items.filter((item) => {
        if (seen.has(item.id)) return false
        seen.add(item.id)
        return true
    })
}