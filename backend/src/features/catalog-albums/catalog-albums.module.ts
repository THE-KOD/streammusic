import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistsModule } from '../catalog-artists/catalog-artists.module';
import { AlbumOrmEntity } from './data/orm/album.orm-entity';
import { TypeOrmAlbumRepository } from './data/typeorm-album.repository';
import { ALBUM_REPOSITORY } from './domain/album.repository';
import { AlbumsService } from './presentation/albums.service';
import { AlbumsController } from './presentation/albums.controller';
import {UsersModule} from "../users/users.module";

@Module({
    // ArtistsModule importé pour ARTISTE_REPOSITORY (vérifier qu'un artiste
    // existe avant de créer un album) — même pattern que auth -> users.
    imports: [ArtistsModule, UsersModule, TypeOrmModule.forFeature([AlbumOrmEntity])],
    controllers: [AlbumsController],
    providers: [
        { provide: ALBUM_REPOSITORY, useClass: TypeOrmAlbumRepository },
        AlbumsService,
    ],
    exports: [ALBUM_REPOSITORY],
})
export class AlbumsModule {}