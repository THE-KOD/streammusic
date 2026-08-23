import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TracksModule } from '../catalog-tracks/catalog-tracks.module';
import { PlaylistOrmEntity } from './data/orm/playlist.orm-entity';
import { PlaylistTitreOrmEntity } from './data/orm/playlist-titre.orm-entity';
import { TypeOrmPlaylistRepository } from './data/typeorm-playlist.repository';
import { TypeOrmPlaylistTrackRepository } from './data/typeorm-playlist-track.repository';
import { PLAYLIST_REPOSITORY } from './domain/playlist.repository';
import { PLAYLIST_TRACK_REPOSITORY } from './domain/playlist-track.repository';
import { PlaylistsService } from './presentation/playlists.service';
import { PlaylistsController } from './presentation/playlists.controller';

@Module({
    imports: [TracksModule, TypeOrmModule.forFeature([PlaylistOrmEntity, PlaylistTitreOrmEntity])],
    controllers: [PlaylistsController],
    providers: [
        { provide: PLAYLIST_REPOSITORY, useClass: TypeOrmPlaylistRepository },
        { provide: PLAYLIST_TRACK_REPOSITORY, useClass: TypeOrmPlaylistTrackRepository },
        PlaylistsService,
    ],
})
export class PlaylistsModule {}