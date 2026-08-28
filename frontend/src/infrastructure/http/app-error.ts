// Miroir du format d'erreur renvoyé par GlobalExceptionFilter côté backend :
// { error: { code, message }, timestamp, path }
export class AppError extends Error {
    public readonly code: string
    public readonly status?: number

    constructor(code: string, message: string, status?: number) {
        super(message)
        this.code = code
        this.status = status
    }
}