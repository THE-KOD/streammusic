import { Module } from '@nestjs/common';
import { AdminAccessModule } from './admin-access.module';
import { UsersModule } from '../users/users.module';
import { TracksModule } from '../catalog-tracks/catalog-tracks.module';
import { AdminService } from './presentation/admin.service';
import { AdminController } from './presentation/admin.controller';

@Module({
    imports: [AdminAccessModule, UsersModule, TracksModule],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule {}