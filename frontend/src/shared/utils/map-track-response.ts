import type { Track } from '../types/track'

// Ne modélise QUE les champs réellement lus par mapTrackResponse ci-dessous —
// /tracks et /search renvoient des formes différentes, mais toutes deux
// satisfont structurellement cette interface allégée.
export interface BackendTrackDto {
    id: string
    albumId?: string | null
    artisteId: string
    artisteNom?: string
    albumTitre?: string
    titre: string
    duree: number
    fichierAudioUrl: string
    pochetteUrl: string | null
    nombreEcoutes?: number
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