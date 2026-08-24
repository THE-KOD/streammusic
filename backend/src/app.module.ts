import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './infrastructure/config/env.validation';
import { DatabaseModule } from './infrastructure/database/database.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { GenresModule } from './features/catalog-genres/catalog-genres.module';
import { ArtistsModule } from './features/catalog-artists/catalog-artists.module';
import { AlbumsModule } from './features/catalog-albums/catalog-albums.module';
import { TracksModule } from './features/catalog-tracks/catalog-tracks.module';
import { PlaylistsModule } from './features/playlists/playlists.module';
import { FavoritesModule } from './features/favorites/favorites.module';
import { FollowsModule } from './features/follows/follows.module';
import { ListeningHistoryModule } from './features/listening-history/listening-history.module';
import { QueueModule } from './features/queue/queue.module';
import { NotificationsModule } from './features/notifications/notifications.module';
import { SuggestionsModule } from './features/suggestions/suggestions.module';
import { SubscriptionsModule } from './features/subscriptions/subscriptions.module';
import { SearchModule } from './features/search/search.module';
import { AdminModule } from './features/admin/admin.module';
import { EventEmitterModule } from '@nestjs/event-emitter';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      validationSchema: envValidationSchema,
    }),
    DatabaseModule,
    EventEmitterModule.forRoot(), // nouveau — global par défaut, injectable partout sans réimport
    AuthModule,
    UsersModule,
    UsersModule,
    GenresModule,
    ArtistsModule,
    AlbumsModule,
    TracksModule,
    PlaylistsModule,
    FavoritesModule,
    FollowsModule,
    ListeningHistoryModule,
    QueueModule,
    NotificationsModule,
    SuggestionsModule,
    SubscriptionsModule,
    SearchModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
