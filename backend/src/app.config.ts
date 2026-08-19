import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';
import { ValidationError } from './core/errors';

export function configureApp(app: INestApplication): void {
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            exceptionFactory: (errors) => {
                const message = errors.map((e) => Object.values(e.constraints ?? {}).join(', ')).join(' | ');
                return new ValidationError(message || 'Requête invalide.');
            },
        }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
}