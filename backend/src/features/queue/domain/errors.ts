import { NotFoundError, ConflictError } from '../../../core/errors';

export class TitreDejaDansFileError extends ConflictError {
    constructor() {
        super("Ce titre est déjà présent dans la file d'attente.");
    }
}

export class TitreAbsentDeFileError extends NotFoundError {
    constructor() {
        super("Ce titre n'appartient pas à la file d'attente.");
    }
}