import type { ArtistProfile } from '../domain/artist-profile.entity'
import type { Track } from '../../../shared/types/track'
import type { Album } from '../../../shared/types/album'
import { ArtistNotFoundError } from '../domain/errors'

const FAKE_DELAY_MS = 800

const MOCK_ARTIST: ArtistProfile = {
    id: 'a1',
    name: 'Nova Kline',
    bio: "Biographie de l'artiste. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
}

const MOCK_TRACKS: Track[] = [
    { id: 't1', title: 'Midnight Drive', artistName: 'Nova Kline', artistId: 'a1', albumTitle: 'Neon Static', albumId: 'album-1', duration: 222, playCount: 15420 },
    { id: 't2', title: 'Static Bloom', artistName: 'Nova Kline', artistId: 'a1', albumTitle: 'Neon Static', albumId: 'album-1', duration: 198, playCount: 9800 },
]

const MOCK_ALBUMS: Album[] = [
    { id: 'album-1', title: 'Neon Static', releaseDate: '2026-01-01' },
    { id: 'album-2', title: 'Low Tide', releaseDate: '2025-06-15' },
]

export const artistProfileService = {
    async getArtistProfile(artistId: string): Promise<{ artist: ArtistProfile; tracks: Track[]; albums: Album[] }> {
        await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS))
        if (artistId !== 'a1') throw new ArtistNotFoundError()
        return { artist: MOCK_ARTIST, tracks: MOCK_TRACKS, albums: MOCK_ALBUMS }
    },
}