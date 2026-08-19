import { UnauthorizedError } from '../../../core/errors';

export class InvalidCredentialsError extends UnauthorizedError {
    constructor() {
        super('Email ou mot de passe incorrect.');
    }
}

export class SessionInvalideError extends UnauthorizedError {
    constructor() {
        super('Session expirée ou invalide, veuillez vous reconnecter.');
    }
}

export class CompteSuspenduError extends UnauthorizedError {
    constructor() {
        super('Ce compte est suspendu.');
    }
}