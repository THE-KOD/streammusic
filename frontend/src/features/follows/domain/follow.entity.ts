export interface FollowStatus {
    artistId: string
    isFollowing: boolean
}

export interface FollowedArtist {
    id: string
    name: string
    imageUrl?: string
}