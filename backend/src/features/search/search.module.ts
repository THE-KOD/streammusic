import { Module } from '@nestjs/common';
import { MeiliSearchModule } from '../../infrastructure/search/meilisearch.module';
import { TracksModule } from '../catalog-tracks/catalog-tracks.module';
import { GenresModule } from '../catalog-genres/catalog-genres.module';
import { AlbumsModule } from '../catalog-albums/catalog-albums.module';
import { ArtistsModule } from '../catalog-artists/catalog-artists.module';
import { UsersModule } from '../users/users.module';
import { MeiliSearchTrackSearchRepository } from './data/meilisearch-track-search.repository';
import { TRACK_SEARCH_REPOSITORY } from './domain/track-search.repository';
import { SearchService } from './presentation/search.service';
import { SearchController } from './presentation/search.controller';
import { TrackIndexingListener } from './presentation/listeners/track-indexing.listener';

@Module({
    imports: [MeiliSearchModule, TracksModule, GenresModule, AlbumsModule, ArtistsModule, UsersModule],
    controllers: [SearchController],
    providers: [
        { provide: TRACK_SEARCH_REPOSITORY, useClass: MeiliSearchTrackSearchRepository },
        SearchService,
        TrackIndexingListener,
    ],
})
export class SearchModule {}