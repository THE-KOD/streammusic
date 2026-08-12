export class FollowActionFailedError extends Error {
    constructor() {
        super('Impossible de suivre cet artiste.')
        this.name = 'FollowActionFailedError'
    }
}