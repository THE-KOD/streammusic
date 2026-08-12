export class AlbumNotFoundError extends Error {
    constructor() {
        super('Album introuvable.')
        this.name = 'AlbumNotFoundError'
    }
}