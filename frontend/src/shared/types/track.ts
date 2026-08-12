export interface Track {
    id: string
    title: string
    artistName: string
    artistId: string
    albumTitle?: string
    albumId?: string
    duration: number
    coverUrl?: string
    playCount?: number
}