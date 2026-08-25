import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Meilisearch } from 'meilisearch';
export const MEILISEARCH_CLIENT = Symbol('MEILISEARCH_CLIENT');

export const MeiliSearchProvider: Provider = {
    provide: MEILISEARCH_CLIENT,
    inject: [ConfigService],
    useFactory: (config: ConfigService) =>
        new Meilisearch({
            host: config.get<string>('MEILISEARCH_HOST')!,
            apiKey: config.get<string>('MEILISEARCH_API_KEY'),
        }),
};