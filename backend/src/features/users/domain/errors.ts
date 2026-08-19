import { NotFoundError, ConflictError } from '../../../core/errors';

export class UtilisateurNotFoundError extends NotFoundError {
    constructor(identifiant: string) {
        super(`Utilisateur introuvable : ${identifiant}`);
    }
}

export class EmailDejaUtiliseError extends ConflictError {
    constructor(email: string) {
        super(`Un compte existe déjà avec l'email ${email}`);
    }
}

export class PseudoDejaUtiliseError extends ConflictError {
    constructor(pseudo: string) {
        super(`Le pseudo "${pseudo}" est déjà pris`);
    }
}