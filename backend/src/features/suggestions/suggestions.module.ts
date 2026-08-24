import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TracksModule } from '../catalog-tracks/catalog-tracks.module';
import { ListeningHistoryModule } from '../listening-history/listening-history.module';
import { SuggestionOrmEntity } from './data/orm/suggestion.orm-entity';
import { TypeOrmSuggestionRepository } from './data/typeorm-suggestion.repository';
import { SUGGESTION_REPOSITORY } from './domain/suggestion.repository';
import { SuggestionsService } from './presentation/suggestions.service';
import { SuggestionsController } from './presentation/suggestions.controller';

@Module({
    imports: [TracksModule, ListeningHistoryModule, TypeOrmModule.forFeature([SuggestionOrmEntity])],
    controllers: [SuggestionsController],
    providers: [
        { provide: SUGGESTION_REPOSITORY, useClass: TypeOrmSuggestionRepository },
        SuggestionsService,
    ],
})
export class SuggestionsModule {}