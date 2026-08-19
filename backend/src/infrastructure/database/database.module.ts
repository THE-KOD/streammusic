import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'mysql',
                url: config.get<string>('DATABASE_URL'),
                autoLoadEntities: true,
                synchronize: false, // le schéma SQL déjà écrit est la source de vérité, jamais généré par l'ORM
                charset: 'utf8mb4',
                logging: config.get<string>('NODE_ENV') === 'development',
            }),
        }),
    ],
})
export class DatabaseModule {}