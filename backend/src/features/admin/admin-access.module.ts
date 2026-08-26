import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministrateurOrmEntity } from './data/orm/administrateur.orm-entity';
import { TypeOrmAdministrateurRepository } from './data/typeorm-administrateur.repository';
import { ADMINISTRATEUR_REPOSITORY } from './domain/administrateur.repository';
import { AdminGuard } from './presentation/guards/admin.guard';

// Séparé de AdminModule (contrôleurs dashboard/utilisateurs) — voir la
// décision n°3 en tête de réponse sur la dépendance circulaire évitée.
@Module({
    imports: [TypeOrmModule.forFeature([AdministrateurOrmEntity])],
    providers: [
        { provide: ADMINISTRATEUR_REPOSITORY, useClass: TypeOrmAdministrateurRepository },
        AdminGuard,
    ],
    exports: [ADMINISTRATEUR_REPOSITORY, AdminGuard],
})
export class AdminAccessModule {}