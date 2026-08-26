import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreOrmEntity } from './data/orm/genre.orm-entity';
import { TypeOrmGenreRepository } from './data/typeorm-genre.repository';
import { GENRE_REPOSITORY } from './domain/genre.repository';
import { GenresService } from './presentation/genres.service';
import { GenresController } from './presentation/genres.controller';
import {AdminAccessModule} from "../admin/admin-access.module";

@Module({
    imports: [TypeOrmModule.forFeature([GenreOrmEntity]), AdminAccessModule],
    controllers: [GenresController],
    providers: [
        { provide: GENRE_REPOSITORY, useClass: TypeOrmGenreRepository },
        GenresService,
    ],
    // Exporté : catalog-tracks aura besoin de GENRE_REPOSITORY pour vérifier
    // qu'un genre_id fourni existe bien avant de créer un titre.
    exports: [GENRE_REPOSITORY],
})
export class GenresModule {}