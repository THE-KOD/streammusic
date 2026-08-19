import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configureApp } from './app.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    configureApp(app);

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