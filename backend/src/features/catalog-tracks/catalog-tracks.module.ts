import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistsModule } from '../catalog-artists/catalog-artists.module';
import { GenresModule } from '../catalog-genres/catalog-genres.module';
import { AlbumsModule } from '../catalog-albums/catalog-albums.module';
import { TrackOrmEntity } from './data/orm/track.orm-entity';
import { TypeOrmTrackRepository } from './data/typeorm-track.repository';
import { TRACK_REPOSITORY } from './domain/track.repository';
import { TracksService } from './presentation/tracks.service';
import { TracksController } from './presentation/tracks.controller';
import {AdminAccessModule} from "../admin/admin-access.module";

@Module({
    // Les trois modules importés fournissent chacun leur repository via token —
    // TracksService en a besoin pour vérifier l'existence d'un artiste/genre/album
    // avant de créer ou modifier un titre.
    imports: [ArtistsModule, GenresModule, AlbumsModule, AdminAccessModule, TypeOrmModule.forFeature([TrackOrmEntity])],
    controllers: [TracksController],
    providers: [
        { provide: TRACK_REPOSITORY, useClass: TypeOrmTrackRepository },
        TracksService,
    ],
    // Exporté : playlists, favorites, listening-history, queue, suggestions
    // en auront tous besoin (Track = entité pivot).
    exports: [TRACK_REPOSITORY],
})
export class TracksModule {}