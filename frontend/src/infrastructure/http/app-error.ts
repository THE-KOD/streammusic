// Miroir du format d'erreur renvoyé par GlobalExceptionFilter côté backend :
// { error: { code, message }, timestamp, path }
export class AppError extends Error {
    constructor(
        public readonly code: string,
        message: string,
        public readonly status?: number,
    ) {
        super(message)
        this.name = 'AppError'
    }
}