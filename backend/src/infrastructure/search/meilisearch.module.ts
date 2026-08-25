import { Module } from '@nestjs/common';
import { MeiliSearchProvider } from './meilisearch.provider';

@Module({
    providers: [MeiliSearchProvider],
    exports: [MeiliSearchProvider],
})
export class MeiliSearchModule {}