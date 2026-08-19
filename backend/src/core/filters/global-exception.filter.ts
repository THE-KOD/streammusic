import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response, Request } from 'express';
import { DomainError } from '../errors';

const STATUS_BY_CODE: Record<string, number> = {
    NOT_FOUND: HttpStatus.NOT_FOUND,
    CONFLICT: HttpStatus.CONFLICT,
    VALIDATION_ERROR: HttpStatus.BAD_REQUEST,
    UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
    FORBIDDEN: HttpStatus.FORBIDDEN,
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger('UnhandledException');

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const timestamp = new Date().toISOString();
        const path = request.url;

        if (exception instanceof DomainError) {
            const status = STATUS_BY_CODE[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
            response.status(status).json({ error: { code: exception.code, message: exception.message }, timestamp, path });
            return;
        }

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const body = exception.getResponse();
            const errorBody = typeof body === 'string' ? { code: 'HTTP_ERROR', message: body } : body;
            response.status(status).json({ error: errorBody, timestamp, path });
            return;
        }

        this.logger.error(exception instanceof Error ? exception.stack : exception);
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: { code: 'INTERNAL_ERROR', message: 'Une erreur interne est survenue.' },
            timestamp,
            path,
        });
    }
}