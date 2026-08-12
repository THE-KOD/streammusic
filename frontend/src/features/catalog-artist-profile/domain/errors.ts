export class ArtistNotFoundError extends Error {
    constructor() {
        super('Artiste introuvable.')
        this.name = 'ArtistNotFoundError'
    }
}