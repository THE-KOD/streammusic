export class TrackSubmissionError extends Error {
    constructor() {
        super('Erreur lors de la soumission du titre.')
        this.name = 'TrackSubmissionError'
    }
}