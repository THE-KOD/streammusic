import type { Artist } from '../../../shared/types/artist'

export interface FollowStatus {
    artistId: string
    isFollowing: boolean
}

export type FollowedArtist = Artist