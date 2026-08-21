import { NotFoundError } from '../../../core/errors';

export class TrackNotFoundError extends NotFoundError {
    constructor(id: string) {
        super(`Titre introuvable : ${id}`);
    }
}