import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configureApp } from './app.config';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    configureApp(app);

    app.enableCors({ origin: app.get(ConfigService).get<string>('FRONTEND_URL') });

    // Sert les fichiers uploadés (audio, pochettes) en statique — voir
    // infrastructure/storage/ pour le détail du stockage local.
    app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

    const swaggerConfig = new DocumentBuilder()
        .setTitle('StreamMusic API')
        .setDescription('API REST du projet StreamMusic')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);

    await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();