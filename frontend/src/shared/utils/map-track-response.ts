import type { Track } from '../types/track'

// Forme exacte renvoyée par le backend (TrackResponseDto) — les noms de
// champs restent en français côté API. La traduction vers le vocabulaire
// anglais déjà utilisé dans toute la couche presentation se fait ICI,
// une seule fois — TrackRow/TrackCard n'ont jamais besoin de le savoir.
export interface BackendTrackDto {
    id: string
    albumId: string | null
    artisteId: string
    artisteNom?: string
    albumTitre?: string
    genreId: string
    titre: string
    duree: number
    fichierAudioUrl: string
    pochetteUrl: string | null
    dateSortie: string | null
    nombreEcoutes: number
    dateAjout: string
    statutModeration: string
}

export function mapTrackResponse(dto: BackendTrackDto): Track {
    return {
        id: dto.id,
        title: dto.titre,
        artistName: dto.artisteNom ?? 'Artiste inconnu',
        artistId: dto.artisteId,
        albumTitle: dto.albumTitre,
        albumId: dto.albumId ?? undefined,
        duration: dto.duree,
        coverUrl: dto.pochetteUrl ?? undefined,
        playCount: dto.nombreEcoutes,
        fileUrl: dto.fichierAudioUrl,
    }
}