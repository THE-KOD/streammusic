import { NotFoundError, ConflictError } from '../../../core/errors';

export class GenreNotFoundError extends NotFoundError {
    constructor(id: string) {
        super(`Genre introuvable : ${id}`);
    }
}

export class GenreNomDejaUtiliseError extends ConflictError {
    constructor(nom: string) {
        super(`Le genre "${nom}" existe déjà.`);
    }
}

export class GenreEnUsageError extends ConflictError {
    constructor(id: string) {
        super(`Le genre ${id} est utilisé par au moins un titre et ne peut pas être supprimé.`);
    }
}