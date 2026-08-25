import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { Meilisearch } from 'meilisearch';
import { MEILISEARCH_CLIENT } from '../../../infrastructure/search/meilisearch.provider';
import { TrackSearchDocument, TrackSearchFilters, TrackSearchRepository } from '../domain/track-search.repository';

const INDEX_NAME = 'tracks';

@Injectable()
export class MeiliSearchTrackSearchRepository implements TrackSearchRepository, OnModuleInit {
    private readonly logger = new Logger(MeiliSearchTrackSearchRepository.name);

    constructor(@Inject(MEILISEARCH_CLIENT) private readonly client: Meilisearch) {}

    // Configuration exécutée à chaque démarrage — idempotente, MeiliSearch ne
    // reconstruit l'index que si les réglages changent réellement.
    async onModuleInit(): Promise<void> {
        try {
            const index = this.client.index(INDEX_NAME);
            await index.updateFilterableAttributes(['genreId', 'duree']);
            await index.updateSortableAttributes(['dateSortie', 'duree']);
        } catch (err) {
            this.logger.error(`Impossible de configurer l'index MeiliSearch "${INDEX_NAME}" — MeiliSearch est-il démarré ?`, err);
        }
    }

    async indexTrack(doc: TrackSearchDocument): Promise<void> {
        await this.client.index(INDEX_NAME).addDocuments([doc], { primaryKey: 'id' });
    }

    async removeTrack(id: string): Promise<void> {
        await this.client.index(INDEX_NAME).deleteDocument(id);
    }

    async search(query: string, filters?: TrackSearchFilters, limit = 20): Promise<TrackSearchDocument[]> {
        const filterParts: string[] = [];
        if (filters?.genreId) filterParts.push(`genreId = "${filters.genreId}"`);
        if (filters?.dureeMin !== undefined) filterParts.push(`duree >= ${filters.dureeMin}`);
        if (filters?.dureeMax !== undefined) filterParts.push(`duree <= ${filters.dureeMax}`);

        const result = await this.client.index(INDEX_NAME).search<TrackSearchDocument>(query, {
            filter: filterParts.length > 0 ? filterParts.join(' AND ') : undefined,
            limit,
        });
        return result.hits;
    }
}