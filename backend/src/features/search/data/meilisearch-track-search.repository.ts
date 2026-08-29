import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Meilisearch } from 'meilisearch';
import { MEILISEARCH_CLIENT } from '../../../infrastructure/search/meilisearch.provider';
import { TrackSearchDocument, TrackSearchFilters, TrackSearchRepository } from '../domain/track-search.repository';

@Injectable()
export class MeiliSearchTrackSearchRepository implements TrackSearchRepository, OnModuleInit {
    private readonly logger = new Logger(MeiliSearchTrackSearchRepository.name);
    // Isolé par environnement — sans ça, les tests e2e (NODE_ENV=test) et le
    // développement partagent le même index, alors que MySQL est déjà séparé
    // (streammusic vs streammusic_test) depuis la Phase 3. C'est cette
    // isolation manquante qui a causé la pollution observée.
    private readonly indexName: string;

    constructor(
        @Inject(MEILISEARCH_CLIENT) private readonly client: Meilisearch,
        config: ConfigService,
    ) {
        this.indexName = config.get<string>('NODE_ENV') === 'test' ? 'tracks_test' : 'tracks';
    }

    async onModuleInit(): Promise<void> {
        try {
            const index = this.client.index(this.indexName);
            await index.updateFilterableAttributes(['genreId', 'duree']);
            await index.updateSortableAttributes(['dateSortie', 'duree']);
        } catch (err) {
            this.logger.error(`Impossible de configurer l'index MeiliSearch "${this.indexName}" — MeiliSearch est-il démarré ?`, err);
        }
    }

    async indexTrack(doc: TrackSearchDocument): Promise<void> {
        await this.client.index(this.indexName).addDocuments([doc], { primaryKey: 'id' });
    }

    async removeTrack(id: string): Promise<void> {
        await this.client.index(this.indexName).deleteDocument(id);
    }

    async search(query: string, filters?: TrackSearchFilters, limit = 20): Promise<TrackSearchDocument[]> {
        const filterParts: string[] = [];
        if (filters?.genreId) filterParts.push(`genreId = "${filters.genreId}"`);
        if (filters?.dureeMin !== undefined) filterParts.push(`duree >= ${filters.dureeMin}`);
        if (filters?.dureeMax !== undefined) filterParts.push(`duree <= ${filters.dureeMax}`);

        const result = await this.client.index(this.indexName).search<TrackSearchDocument>(query, {
            filter: filterParts.length > 0 ? filterParts.join(' AND ') : undefined,
            limit,
        });
        return result.hits;
    }
}