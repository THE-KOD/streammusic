import { CATALOG_ARTISTS_MOCK } from '../../../shared/mocks/catalog-artists.mock'
import { CATALOG_ALBUMS_MOCK } from '../../../shared/mocks/catalog-albums.mock'
import { CATALOG_GENRES_MOCK } from '../../../shared/mocks/catalog-genres.mock'
import type { Artist } from '../../../shared/types/artist'
import type { Album } from '../../../shared/types/album'
import type { Genre } from '../../../shared/types/genre'
import type { NewTrackPayload } from '../domain/upload.entity'
import { TrackSubmissionError } from '../domain/errors'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const uploadCatalogService = {
    async listArtists(): Promise<Artist[]> {
        await delay(500)
        return CATALOG_ARTISTS_MOCK
    },
    async listAlbumsByArtist(artistId: string): Promise<Album[]> {
        await delay(300)
        return CATALOG_ALBUMS_MOCK.filter((a) => a.artistId === artistId)
    },
    async listGenres(): Promise<Genre[]> {
        await delay(500)
        return CATALOG_GENRES_MOCK
    },
    async submitTrack(_payload: NewTrackPayload): Promise<void> {
        await delay(1500)
        // 1 échec sur 10 simulé — sans ça, le bouton "Réessayer" déjà codé
        // dans la page ne pourrait jamais réellement se déclencher.
        if (Math.random() < 0.1) throw new TrackSubmissionError()
    },
}