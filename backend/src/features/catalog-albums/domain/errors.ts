import { NotFoundError } from '../../../core/errors';

export class AlbumNotFoundError extends NotFoundError {
    constructor(id: string) {
        super(`Album introuvable : ${id}`);
    }
}