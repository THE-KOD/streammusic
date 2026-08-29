/**
 * Reconstruit entièrement l'index de recherche à partir de MySQL. Utile
 * après une pollution de l'index (anciens tests, avant l'isolation par
 * environnement) ou pour indexer des titres insérés directement en SQL
 * (qui contournent TRACK_VALIDATED_EVENT et ne sont donc jamais indexés).
 * Usage : npx ts-node scripts/reindex-search.ts
 */
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Meilisearch } from 'meilisearch';

async function main() {
    const dataSource = new DataSource({ type: 'mysql', url: process.env.DATABASE_URL });
    await dataSource.initialize();

    const meili = new Meilisearch({ host: process.env.MEILISEARCH_HOST!, apiKey: process.env.MEILISEARCH_API_KEY });
    const index = meili.index('tracks');

    console.log("Vidage de l'index actuel (fantômes inclus)...");
    await index.deleteAllDocuments();

    const rows = await dataSource.query(`
    SELECT t.id, t.titre, t.artiste_id AS artisteId, u.pseudo AS artisteNom,
           t.album_id AS albumId, al.titre AS albumTitre,
           t.genre_id AS genreId, g.nom AS genreNom,
           t.duree, t.fichier_audio_url AS fichierAudioUrl,
           t.date_sortie AS dateSortie, t.pochette_url AS pochetteUrl
    FROM titre t
    JOIN utilisateur u ON u.id = t.artiste_id
    JOIN genre g ON g.id = t.genre_id
    LEFT JOIN album al ON al.id = t.album_id
    WHERE t.statut_moderation = 'VALIDE'
  `);

    if (rows.length > 0) await index.addDocuments(rows, { primaryKey: 'id' });
    console.log(`${rows.length} titre(s) réindexé(s) depuis la base réelle.`);

    await dataSource.destroy();
}

main();