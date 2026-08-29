import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TracksModule } from '../catalog-tracks/catalog-tracks.module';
import { AlbumsModule } from '../catalog-albums/catalog-albums.module';
import { FavoriOrmEntity } from './data/orm/favori.orm-entity';
import { AlbumFavoriOrmEntity } from './data/orm/album-favori.orm-entity';
import { TypeOrmFavorisRepository } from './data/typeorm-favoris.repository';
import { FAVORIS_REPOSITORY } from './domain/favoris.repository';
import { FavoritesService } from './presentation/favorites.service';
import { FavoritesController } from './presentation/favorites.controller';
import {UsersModule} from "../users/users.module";

@Module({
    // TracksModule et AlbumsModule importés pour vérifier l'existence d'un
    // titre/album avant de l'ajouter en favori, et pour résoudre les ids
    // favoris vers des objets complets lors de la lecture.
    imports: [TracksModule, AlbumsModule, UsersModule, TypeOrmModule.forFeature([FavoriOrmEntity, AlbumFavoriOrmEntity])],
    controllers: [FavoritesController],
    providers: [
        { provide: FAVORIS_REPOSITORY, useClass: TypeOrmFavorisRepository },
        FavoritesService,
    ],
})
export class FavoritesModule {}