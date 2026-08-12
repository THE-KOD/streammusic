import type { Album } from '../../../shared/types/album'
import type { Track } from '../../../shared/types/track'

export interface AlbumDetail extends Album {
    totalDuration: number
}

export type AlbumTrack = Pick<Track, 'id' | 'title' | 'duration'>