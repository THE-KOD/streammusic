import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ArtisteOrmEntity } from './data/orm/artiste.orm-entity';
import { TypeOrmArtisteRepository } from './data/typeorm-artiste.repository';
import { ARTISTE_REPOSITORY } from './domain/artiste.repository';
import { ArtistsService } from './presentation/artists.service';
import { ArtistsController } from './presentation/artists.controller';

@Module({
    // UsersModule importé pour accéder à UTILISATEUR_REPOSITORY (vérifier
    // l'existence d'un utilisateur, récupérer son pseudo) — jamais un import
    // direct vers users/data/..., toujours via le token du barrel.
    imports: [UsersModule, TypeOrmModule.forFeature([ArtisteOrmEntity])],
    controllers: [ArtistsController],
    providers: [
        { provide: ARTISTE_REPOSITORY, useClass: TypeOrmArtisteRepository },
        ArtistsService,
    ],
    exports: [ARTISTE_REPOSITORY],
})
export class ArtistsModule {}