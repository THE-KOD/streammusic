export class GenreInUseError extends Error {
    constructor() {
        super('Ce genre est utilisé par au moins un titre et ne peut pas être supprimé.')
        this.name = 'GenreInUseError'
    }
}