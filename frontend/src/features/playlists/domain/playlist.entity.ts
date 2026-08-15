import type { Track } from '../../../shared/types/track'

export interface Playlist {
    id: string
    name: string
    isPublic: boolean
    trackCount: number
}

export interface PlaylistTrack {
    id: string
    position: number
    track: Track
}