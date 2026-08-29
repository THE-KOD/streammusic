import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistsModule } from '../catalog-artists/catalog-artists.module';
import { UsersModule } from '../users/users.module';
import { SuiviOrmEntity } from './data/orm/suivi.orm-entity';
import { TypeOrmFollowsRepository } from './data/typeorm-follows.repository';
import { FOLLOWS_REPOSITORY } from './domain/follows.repository';
import { FollowsService } from './presentation/follows.service';
import { FollowsController } from './presentation/follows.controller';
import {TracksModule} from "../catalog-tracks/catalog-tracks.module";

@Module({
    imports: [ArtistsModule, UsersModule, TracksModule, TypeOrmModule.forFeature([SuiviOrmEntity])],
    controllers: [FollowsController],
    providers: [{ provide: FOLLOWS_REPOSITORY, useClass: TypeOrmFollowsRepository }, FollowsService],
    exports: [FOLLOWS_REPOSITORY],
})
export class FollowsModule {}