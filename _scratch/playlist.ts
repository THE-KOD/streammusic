// shared/types/playlist.ts
import type { Track } from '../frontend/src/shared/types/track'

export interface Playlist {
    id: string
    name: string
    isPublic: boolean
    trackCount: number
    tracks?: PlaylistTrack[]
}

export interface PlaylistTrack {
    id: string
    position: number
    track: Track
}