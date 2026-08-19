import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilisateurOrmEntity } from './data/orm/utilisateur.orm-entity';
import { TypeOrmUtilisateurRepository } from './data/typeorm-utilisateur.repository';
import { UTILISATEUR_REPOSITORY } from './domain/user.repository';

@Module({
    imports: [TypeOrmModule.forFeature([UtilisateurOrmEntity])],
    providers: [
        { provide: UTILISATEUR_REPOSITORY, useClass: TypeOrmUtilisateurRepository },
    ],
    exports: [UTILISATEUR_REPOSITORY],
})
export class UsersModule {}