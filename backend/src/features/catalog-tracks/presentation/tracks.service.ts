import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TRACK_REPOSITORY } from '../domain/track.repository';
import type { TrackRepository, TrackFilters } from '../domain/track.repository';
import { Track } from '../domain/track.entity';
import { TrackNotFoundError } from '../domain/errors';
import { ARTISTE_REPOSITORY, ArtisteNotFoundError } from '../../catalog-artists';
import type { ArtisteRepository } from '../../catalog-artists';
import { GENRE_REPOSITORY, GenreNotFoundError } from '../../catalog-genres';
import type { GenreRepository } from '../../catalog-genres';
import { ALBUM_REPOSITORY, AlbumNotFoundError } from '../../catalog-albums';
import type { AlbumRepository } from '../../catalog-albums';
import { ForbiddenError } from '../../../core/errors';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TrackValidatedEvent, TRACK_VALIDATED_EVENT } from '../domain/events/track-validated.event';
import { TrackUnpublishedEvent, TRACK_UNPUBLISHED_EVENT } from '../domain/events/track-unpublished.event';

export interface CreateTrackInput {
    titre: string;
    genreId: string;
    albumId?: string;
    duree: number;
    fichierAudioUrl: string;
    pochetteUrl?: string;
    dateSortie?: string;
}

export interface UpdateTrackInput {
    titre?: string;
    genreId?: string;
    albumId?: string | null;
    pochetteUrl?: string | null;
    dateSortie?: string | null;
}

@Injectable()
export class TracksService {
    constructor(
        @Inject(TRACK_REPOSITORY) private readonly trackRepository: TrackRepository,
        @Inject(ARTISTE_REPOSITORY) private readonly artisteRepository: ArtisteRepository,
        @Inject(GENRE_REPOSITORY) private readonly genreRepository: GenreRepository,
        @Inject(ALBUM_REPOSITORY) private readonly albumRepository: AlbumRepository,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async create(artisteId: string, input: CreateTrackInput): Promise<Track> {
        // Trois vérifications d'existence, dans l'ordre des FK du schéma SQL —
        // chacune renvoie une 404 claire plutôt qu'une erreur SQL de clé étrangère.
        const artisteExiste = await this.artisteRepository.existsById(artisteId);
        if (!artisteExiste) throw new ArtisteNotFoundError(artisteId);

        const genre = await this.genreRepository.findById(input.genreId);
        if (!genre) throw new GenreNotFoundError(input.genreId);

        if (input.albumId) {
            const album = await this.albumRepository.findById(input.albumId);
            if (!album) throw new AlbumNotFoundError(input.albumId);
            // Règle métier propre à nous (pas dans le schéma SQL) : impossible
            // d'ajouter un titre dans l'album de quelqu'un d'autre.
            if (album.artisteId !== artisteId) {
                throw new ForbiddenError("Impossible d'ajouter un titre à l'album d'un autre artiste.");
            }
        }

        const track = Track.create({
            id: randomUUID(),
            albumId: input.albumId ?? null,
            artisteId,
            genreId: input.genreId,
            titre: input.titre,
            duree: input.duree,
            fichierAudioUrl: input.fichierAudioUrl,
            pochetteUrl: input.pochetteUrl ?? null,
            dateSortie: input.dateSortie ?? null,
            nombreEcoutes: 0,
            dateAjout: new Date(),
            statutModeration: 'EN_ATTENTE',
            moderateurId: null,
            dateModeration: null,
        });
        return this.trackRepository.save(track);
    }

    async getById(id: string): Promise<Track> {
        const track = await this.trackRepository.findById(id);
        if (!track) throw new TrackNotFoundError(id);
        return track;
    }

    listPublic(filters?: TrackFilters): Promise<Track[]> {
        return this.trackRepository.findAllValide(filters);
    }

    listMine(artisteId: string): Promise<Track[]> {
        return this.trackRepository.findAllByArtiste(artisteId);
    }

    async update(id: string, connecteId: string, input: UpdateTrackInput): Promise<Track> {
        const track = await this.getById(id);
        if (track.artisteId !== connecteId) {
            throw new ForbiddenError("Vous ne pouvez modifier qu'un titre de votre propre catalogue.");
        }

        if (input.genreId !== undefined) {
            const genre = await this.genreRepository.findById(input.genreId);
            if (!genre) throw new GenreNotFoundError(input.genreId);
        }
        if (input.albumId !== undefined && input.albumId !== null) {
            const album = await this.albumRepository.findById(input.albumId);
            if (!album) throw new AlbumNotFoundError(input.albumId);
            if (album.artisteId !== connecteId) {
                throw new ForbiddenError("Impossible de déplacer ce titre vers l'album d'un autre artiste.");
            }
        }

        const etaitValide = track.statutModeration === 'VALIDE';
        track.modifierMetadonnees(input); // repasse en EN_ATTENTE si etaitValide
        const saved = await this.trackRepository.save(track);

        if (etaitValide && saved.statutModeration === 'EN_ATTENTE') {
            this.eventEmitter.emit(TRACK_UNPUBLISHED_EVENT, new TrackUnpublishedEvent(saved.id));
        }

        return saved;
    }

    async remove(id: string, connecteId: string): Promise<void> {
        const track = await this.getById(id);
        if (track.artisteId !== connecteId) {
            throw new ForbiddenError("Vous ne pouvez supprimer qu'un titre de votre propre catalogue.");
        }
        await this.trackRepository.delete(id);
        // Émis même si le titre n'était pas VALIDE — le listener gère l'absence
        // silencieusement (voir TrackIndexingListener.handleUnpublished).
        this.eventEmitter.emit(TRACK_UNPUBLISHED_EVENT, new TrackUnpublishedEvent(id));
    }

    async moderer(id: string, statut: 'VALIDE' | 'REJETE', moderateurId: string): Promise<Track> {
        const track = await this.getById(id);
        const statutPrecedent = track.statutModeration;

        if (statut === 'VALIDE') track.valider(moderateurId);
        else track.rejeter(moderateurId);
        const saved = await this.trackRepository.save(track);

        // N'émet un événement QUE si le statut a réellement changé — sans ça,
        // re-valider un titre déjà validé renvoyait une notification "nouvelle
        // sortie" en double à tous les followers de l'artiste.
        if (statutPrecedent !== statut) {
            if (statut === 'VALIDE') {
                this.eventEmitter.emit(TRACK_VALIDATED_EVENT, new TrackValidatedEvent(saved.id, saved.titre, saved.artisteId));
            } else {
                this.eventEmitter.emit(TRACK_UNPUBLISHED_EVENT, new TrackUnpublishedEvent(saved.id));
            }
        }

        return saved;
    }
}