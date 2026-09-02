import { Module } from '@nestjs/common';
import { AdminAccessModule } from './admin-access.module';
import { UsersModule } from '../users/users.module';
import { TracksModule } from '../catalog-tracks/catalog-tracks.module';
import { GenresModule } from '../catalog-genres/catalog-genres.module';
import { ArtistsModule } from '../catalog-artists/catalog-artists.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { AdminService } from './presentation/admin.service';
import { AdminController } from './presentation/admin.controller';

@Module({
    imports: [AdminAccessModule, UsersModule, TracksModule, GenresModule, ArtistsModule, SubscriptionsModule],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule {}