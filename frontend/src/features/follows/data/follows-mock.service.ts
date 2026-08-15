import { CATALOG_ARTISTS_MOCK } from '../../../shared/mocks/catalog-artists.mock'
import type { FollowedArtist } from '../domain/follow.entity'

const FAKE_DELAY_MS = 500
const delay = () => new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS))

let followedArtistIds = new Set<string>(['a1'])

export const followsService = {
    async follow(artistId: string): Promise<void> { await delay(); followedArtistIds.add(artistId) },
    async unfollow(artistId: string): Promise<void> { await delay(); followedArtistIds.delete(artistId) },
    async listFollowed(): Promise<FollowedArtist[]> {
        await delay()
        return CATALOG_ARTISTS_MOCK.filter((a) => followedArtistIds.has(a.id))
    },
}