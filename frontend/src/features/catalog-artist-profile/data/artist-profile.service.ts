import {uploadFile} from "../../../infrastructure/http/file-upload.ts";
import { apiClient } from '../../../infrastructure/http/api-client'
import { mapTrackResponse, type BackendTrackDto } from '../../../shared/utils/map-track-response'
import { dedupeById } from '../../../shared/utils/dedupe-by-id'
import type { ArtistProfile } from '../domain/artist-profile.entity'
import type { Track } from '../../../shared/types/track'
import type { Album } from '../../../shared/types/album'

interface BackendArtistDto {
    id: string
    pseudo: string
    photoProfilUrl?: string
    biographie: string | null
    photoArtisteUrl: string | null
}
interface BackendArtistStatsDto {
    followersCount: number
    tracksCount: number
}
interface BackendAlbumDto {
    id: string
    artisteId: string
    artisteNom?: string
    titre: string
    pochetteUrl: string | null
    dateSortie: string
}

const NOMBRE_TITRES_POPULAIRES = 10

export const artistProfileService = {
    async getArtistProfile(artistId: string): Promise<{ artist: ArtistProfile; tracks: Track[]; albums: Album[] }> {
        const [artistRes, statsRes, tracksRes, albumsRes] = await Promise.all([
            apiClient.get<BackendArtistDto>(`/artists/${artistId}`),
            apiClient.get<BackendArtistStatsDto>(`/follows/${artistId}/stats`),
            apiClient.get<BackendTrackDto[]>('/tracks', { params: { artisteId: artistId } }),
            apiClient.get<BackendAlbumDto[]>('/albums', { params: { artisteId: artistId } }),
        ])

        const artist: ArtistProfile = {
            id: artistRes.data.id,
            name: artistRes.data.pseudo,
            // Priorité à la photo "artiste" (spécifique au profil public) sur
            // la photo de profil générique — cohérent avec le schéma SQL, qui
            // distingue bien photo_profil_url (utilisateur) et photo_artiste_url.
            imageUrl: artistRes.data.photoArtisteUrl ?? artistRes.data.photoProfilUrl,
            bio: artistRes.data.biographie ?? undefined,
            followersCount: statsRes.data.followersCount,
            tracksCount: statsRes.data.tracksCount,
        }

        // Déduplication à la source, comme convenu — protège les composants
        // même si une future évolution backend introduisait un doublon.
        const tracks = dedupeById(tracksRes.data.map(mapTrackResponse))
            .sort((a, b) => (b.playCount ?? 0) - (a.playCount ?? 0))
            .slice(0, NOMBRE_TITRES_POPULAIRES)

        const albums: Album[] = dedupeById(
            albumsRes.data.map((a) => ({
                id: a.id, title: a.titre, artistName: a.artisteNom, artistId: a.artisteId,
                releaseDate: a.dateSortie, coverUrl: a.pochetteUrl ?? undefined,
            })),
        )

        return { artist, tracks, albums }
    },

    async updateMyProfile(artistId: string, bio: string, photoFile: File | null): Promise<void> {
        const photoArtisteUrl = photoFile ? await uploadFile(photoFile, 'image') : undefined
        await apiClient.patch(`/artists/${artistId}`, { biographie: bio || undefined, photoArtisteUrl })
    },

}