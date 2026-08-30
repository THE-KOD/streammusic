import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenresModule } from '../catalog-genres/catalog-genres.module';
import { UtilisateurOrmEntity } from './data/orm/utilisateur.orm-entity';
import { UtilisateurGenrePrefereOrmEntity } from './data/orm/utilisateur-genre-prefere.orm-entity';
import { TypeOrmUtilisateurRepository } from './data/typeorm-utilisateur.repository';
import { TypeOrmPreferencesRepository } from './data/typeorm-preferences.repository';
import { UTILISATEUR_REPOSITORY } from './domain/user.repository';
import { PREFERENCES_REPOSITORY } from './domain/preferences.repository';
import { UsersService } from './presentation/users.service';
import { UsersController } from './presentation/users.controller';

@Module({
    // GenresModule importé pour valider l'existence des genres — aucun cycle,
    // GenresModule ne dépend jamais de UsersModule en retour.
    imports: [TypeOrmModule.forFeature([UtilisateurOrmEntity, UtilisateurGenrePrefereOrmEntity]), GenresModule],
    controllers: [UsersController],
    providers: [
        { provide: UTILISATEUR_REPOSITORY, useClass: TypeOrmUtilisateurRepository },
        { provide: PREFERENCES_REPOSITORY, useClass: TypeOrmPreferencesRepository },
        UsersService,
    ],
    exports: [UTILISATEUR_REPOSITORY],
})
export class UsersModule {}