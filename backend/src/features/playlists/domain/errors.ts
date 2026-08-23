import { NotFoundError, ConflictError } from '../../../core/errors';

export class PlaylistNotFoundError extends NotFoundError {
    constructor(id: string) {
        super(`Playlist introuvable : ${id}`);
    }
}

export class TitreDejaDansPlaylistError extends ConflictError {
    constructor() {
        super('Ce titre est déjà présent dans la playlist.');
    }
}

export class TitreAbsentDePlaylistError extends NotFoundError {
    constructor() {
        super("Ce titre n'appartient pas à cette playlist.");
    }
}