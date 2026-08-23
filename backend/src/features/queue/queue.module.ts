import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TracksModule } from '../catalog-tracks/catalog-tracks.module';
import { FileAttenteOrmEntity } from './data/orm/file-attente.orm-entity';
import { FileAttenteTitreOrmEntity } from './data/orm/file-attente-titre.orm-entity';
import { TypeOrmQueueRepository } from './data/typeorm-queue.repository';
import { QUEUE_REPOSITORY } from './domain/queue.repository';
import { QueueService } from './presentation/queue.service';
import { QueueController } from './presentation/queue.controller';

@Module({
    imports: [TracksModule, TypeOrmModule.forFeature([FileAttenteOrmEntity, FileAttenteTitreOrmEntity])],
    controllers: [QueueController],
    providers: [
        { provide: QUEUE_REPOSITORY, useClass: TypeOrmQueueRepository },
        QueueService,
    ],
})
export class QueueModule {}