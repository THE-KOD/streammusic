import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistsModule } from '../catalog-artists/catalog-artists.module';
import { GenresModule } from '../catalog-genres/catalog-genres.module';
import { AlbumsModule } from '../catalog-albums/catalog-albums.module';
import { AdminAccessModule } from '../admin/admin-access.module';
import { UsersModule } from '../users/users.module';
import { TrackOrmEntity } from './data/orm/track.orm-entity';
import { TypeOrmTrackRepository } from './data/typeorm-track.repository';
import { TRACK_REPOSITORY } from './domain/track.repository';
import { TracksService } from './presentation/tracks.service';
import { TracksController } from './presentation/tracks.controller';
import { TrackEnrichmentService } from './presentation/track-enrichment.service';

@Module({
    imports: [ArtistsModule, GenresModule, AlbumsModule, AdminAccessModule, UsersModule, TypeOrmModule.forFeature([TrackOrmEntity])],
    controllers: [TracksController],
    providers: [
        { provide: TRACK_REPOSITORY, useClass: TypeOrmTrackRepository },
        TracksService,
        TrackEnrichmentService,
    ],
    // TrackEnrichmentService exporté en plus du repository — suggestions
    // en a besoin pour le même problème d'enrichissement (voir plus bas).
    exports: [TRACK_REPOSITORY, TrackEnrichmentService],
})
export class TracksModule {}