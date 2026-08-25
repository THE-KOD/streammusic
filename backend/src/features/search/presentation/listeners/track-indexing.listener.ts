import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TRACK_SEARCH_REPOSITORY } from '../../domain/track-search.repository';
import type { TrackSearchRepository } from '../../domain/track-search.repository';
import { TRACK_REPOSITORY, TRACK_VALIDATED_EVENT, TRACK_UNPUBLISHED_EVENT, TrackValidatedEvent, TrackUnpublishedEvent } from '../../../catalog-tracks';
import type { TrackRepository } from '../../../catalog-tracks';
import { GENRE_REPOSITORY } from '../../../catalog-genres';
import type { GenreRepository } from '../../../catalog-genres';
import { ALBUM_REPOSITORY } from '../../../catalog-albums';
import type { AlbumRepository } from '../../../catalog-albums';
import { UTILISATEUR_REPOSITORY } from '../../../users';
import type { UtilisateurRepository } from '../../../users';

// Le pont entre catalog-tracks (qui n'importe jamais search) et l'indexation
// réelle — même principe que TrackValidatedListener côté notifications.
@Injectable()
export class TrackIndexingListener {
    private readonly logger = new Logger(TrackIndexingListener.name);

    constructor(
        @Inject(TRACK_SEARCH_REPOSITORY) private readonly searchRepository: TrackSearchRepository,
        @Inject(TRACK_REPOSITORY) private readonly trackRepository: TrackRepository,
        @Inject(GENRE_REPOSITORY) private readonly genreRepository: GenreRepository,
        @Inject(ALBUM_REPOSITORY) private readonly albumRepository: AlbumRepository,
        @Inject(UTILISATEUR_REPOSITORY) private readonly utilisateurRepository: UtilisateurRepository,
    ) {}

    @OnEvent(TRACK_VALIDATED_EVENT)
    async handleValidated(event: TrackValidatedEvent): Promise<void> {
        const track = await this.trackRepository.findById(event.titreId);
        if (!track) return;

        const [utilisateur, genre, album] = await Promise.all([
            this.utilisateurRepository.findById(track.artisteId),
            this.genreRepository.findById(track.genreId),
            track.albumId ? this.albumRepository.findById(track.albumId) : Promise.resolve(null),
        ]);

        await this.searchRepository.indexTrack({
            id: track.id,
            titre: track.titre,
            artisteId: track.artisteId,
            artisteNom: utilisateur?.pseudo ?? 'Artiste inconnu',
            albumId: track.albumId,
            albumTitre: album?.titre ?? null,
            genreId: track.genreId,
            genreNom: genre?.nom ?? '',
            duree: track.duree,
            dateSortie: track.dateSortie,
            pochetteUrl: track.pochetteUrl,
        });
    }

    @OnEvent(TRACK_UNPUBLISHED_EVENT)
    async handleUnpublished(event: TrackUnpublishedEvent): Promise<void> {
        try {
            await this.searchRepository.removeTrack(event.titreId);
        } catch (err) {
            // Ne doit jamais faire planter le flux appelant (suppression/rejet) —
            // un titre jamais indexé (toujours resté EN_ATTENTE) déclenche aussi
            // cet événement, sa "suppression" de l'index est un no-op attendu.
            this.logger.warn(`Retrait de l'index impossible pour ${event.titreId} (probablement jamais indexé).`, err as Error);
        }
    }
}