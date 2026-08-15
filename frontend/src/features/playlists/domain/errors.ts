export class PlaylistNotFoundError extends Error {
    constructor() {
        super('Playlist introuvable.')
        this.name = 'PlaylistNotFoundError'
    }
}