import { UnauthorizedError } from '../../../core/errors';
import { ForbiddenError } from '../../../core/errors';

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


export class MotDePasseActuelIncorrectError extends UnauthorizedError {
    constructor() {
        super('Le mot de passe actuel est incorrect.');
    }
}

export class CompteOAuthSansMotDePasseError extends ForbiddenError {
    constructor() {
        super('Ce compte utilise une connexion externe — aucun mot de passe à modifier.');
    }
}