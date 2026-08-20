import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilisateurOrmEntity } from './data/orm/utilisateur.orm-entity';
import { TypeOrmUtilisateurRepository } from './data/typeorm-utilisateur.repository';
import { UTILISATEUR_REPOSITORY } from './domain/user.repository';
import { UsersService } from './presentation/users.service';
import { UsersController } from './presentation/users.controller';

@Module({
    imports: [TypeOrmModule.forFeature([UtilisateurOrmEntity])],
    controllers: [UsersController],
    providers: [
        { provide: UTILISATEUR_REPOSITORY, useClass: TypeOrmUtilisateurRepository },
        UsersService,
    ],
    exports: [UTILISATEUR_REPOSITORY],
})
export class UsersModule {}