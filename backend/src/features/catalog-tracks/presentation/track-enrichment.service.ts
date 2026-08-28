import { Inject, Injectable } from '@nestjs/common';
import { UTILISATEUR_REPOSITORY } from '../../users';
import type { UtilisateurRepository } from '../../users';
import { ALBUM_REPOSITORY } from '../../catalog-albums';
import type { AlbumRepository } from '../../catalog-albums';
import { Track } from '../domain/track.entity';
import { TrackResponseDto } from './dto/track-response.dto';

// Résout pseudo d'artiste + titre d'album à la frontière HTTP uniquement —
// le domaine Track ne connaît et ne connaîtra jamais que des ids. Aucun
// autre module (playlists, favorites...) n'est affecté par ce fichier.
@Injectable()
export class TrackEnrichmentService {
    constructor(
        @Inject(UTILISATEUR_REPOSITORY) private readonly utilisateurRepository: UtilisateurRepository,
        @Inject(ALBUM_REPOSITORY) private readonly albumRepository: AlbumRepository,
    ) {}

    async enrichOne(track: Track): Promise<TrackResponseDto> {
        const [utilisateur, album] = await Promise.all([
            this.utilisateurRepository.findById(track.artisteId),
            track.albumId ? this.albumRepository.findById(track.albumId) : Promise.resolve(null),
        ]);
        return this.toDto(track, utilisateur?.pseudo, album?.titre);
    }

    async enrichMany(tracks: Track[]): Promise<TrackResponseDto[]> {
        // Résout chaque artiste/album une seule fois même s'il apparaît sur
        // plusieurs titres, plutôt qu'une requête par titre affiché.
        const artisteIds = [...new Set(tracks.map((t) => t.artisteId))];
        const albumIds = [...new Set(tracks.map((t) => t.albumId).filter((id): id is string => id !== null))];

        const [utilisateurs, albums] = await Promise.all([
            Promise.all(artisteIds.map((id) => this.utilisateurRepository.findById(id))),
            Promise.all(albumIds.map((id) => this.albumRepository.findById(id))),
        ]);

        const pseudoParArtiste = new Map(utilisateurs.filter((u) => u !== null).map((u) => [u!.id, u!.pseudo]));
        const titreParAlbum = new Map(albums.filter((a) => a !== null).map((a) => [a!.id, a!.titre]));

        return tracks.map((t) => this.toDto(t, pseudoParArtiste.get(t.artisteId), t.albumId ? titreParAlbum.get(t.albumId) : undefined));
    }

    private toDto(track: Track, artisteNom?: string, albumTitre?: string): TrackResponseDto {
        return {
            id: track.id, albumId: track.albumId, artisteId: track.artisteId, artisteNom, albumTitre,
            genreId: track.genreId, titre: track.titre, duree: track.duree, fichierAudioUrl: track.fichierAudioUrl,
            pochetteUrl: track.pochetteUrl, dateSortie: track.dateSortie, nombreEcoutes: track.nombreEcoutes,
            dateAjout: track.dateAjout, statutModeration: track.statutModeration,
        };
    }
}