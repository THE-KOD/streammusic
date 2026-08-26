import { ForbiddenError } from '../../../core/errors';

export class AdministrateurRequisError extends ForbiddenError {
    constructor() {
        super('Cette action est réservée aux administrateurs.');
    }
}