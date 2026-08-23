import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TracksModule } from '../catalog-tracks/catalog-tracks.module';
import { HistoriqueEcouteOrmEntity } from './data/orm/historique-ecoute.orm-entity';
import { TypeOrmHistoriqueRepository } from './data/typeorm-historique.repository';
import { HISTORIQUE_REPOSITORY } from './domain/historique.repository';
import { ListeningHistoryService } from './presentation/listening-history.service';
import { ListeningHistoryController } from './presentation/listening-history.controller';

@Module({
    imports: [TracksModule, TypeOrmModule.forFeature([HistoriqueEcouteOrmEntity])],
    controllers: [ListeningHistoryController],
    providers: [
        { provide: HISTORIQUE_REPOSITORY, useClass: TypeOrmHistoriqueRepository },
        ListeningHistoryService,
    ],
})
export class ListeningHistoryModule {}