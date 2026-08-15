export interface NewTrackPayload {
    title: string
    artistId: string
    albumId?: string
    genreId: string
    releaseDate?: string
    duration: number
    audioFile: File
    coverFile: File | null
}