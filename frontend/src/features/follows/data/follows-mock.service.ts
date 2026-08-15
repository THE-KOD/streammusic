import type { FollowedArtist } from '../domain/follow.entity'

const FAKE_DELAY_MS = 500
const delay = () => new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS))

const ARTISTS_CATALOG: FollowedArtist[] = [
    { id: 'a1', name: 'Nova Kline' },
    { id: 'a2', name: 'The Reverbs' },
]

let followedArtistIds = new Set<string>(['a1'])

export const followsService = {
    async follow(artistId: string): Promise<void> {
        await delay()
        followedArtistIds.add(artistId)
    },
    async unfollow(artistId: string): Promise<void> {
        await delay()
        followedArtistIds.delete(artistId)
    },
    async listFollowed(): Promise<FollowedArtist[]> {
        await delay()
        return ARTISTS_CATALOG.filter((a) => followedArtistIds.has(a.id))
    },
}