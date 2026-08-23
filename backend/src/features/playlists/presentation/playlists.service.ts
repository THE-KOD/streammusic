import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PLAYLIST_REPOSITORY } from '../domain/playlist.repository';
import type { PlaylistRepository } from '../domain/playlist.repository';
import { PLAYLIST_TRACK_REPOSITORY } from '../domain/playlist-track.repository';
import type { PlaylistTrackRepository } from '../domain/playlist-track.repository';
import { Playlist, Visibilite } from '../domain/playlist.entity';
import { PlaylistNotFoundError, TitreDejaDansPlaylistError, TitreAbsentDePlaylistError } from '../domain/errors';
import { reorderTracks } from '../domain/reorder-tracks';
import { TRACK_REPOSITORY, Track, TrackNotFoundError } from '../../catalog-tracks';
import type { TrackRepository } from '../../catalog-tracks';
import { ForbiddenError } from '../../../core/errors';

export interface PlaylistWithCount {
    playlist: Playlist;
    trackCount: number;
}

@Injectable()
export class PlaylistsService {
    constructor(
        @Inject(PLAYLIST_REPOSITORY) private readonly playlistRepository: PlaylistRepository,
        @Inject(PLAYLIST_TRACK_REPOSITORY) private readonly playlistTrackRepository: PlaylistTrackRepository,
        @Inject(TRACK_REPOSITORY) private readonly trackRepository: TrackRepository,
    ) {}

    async create(proprietaireId: string, nom: string, visibilite: Visibilite = 'PRIVEE'): Promise<PlaylistWithCount> {
        const playlist = Playlist.create({
            id: randomUUID(),
            proprietaireId,
            nom,
            visibilite,
            dateCreation: new Date(),
        });
        const saved = await this.playlistRepository.save(playlist);
        return { playlist: saved, trackCount: 0 };
    }

    // requesterId : qui consulte, pour appliquer la règle de confidentialité
    async getById(id: string, requesterId: string): Promise<PlaylistWithCount> {
        const playlist = await this.playlistRepository.findById(id);
        // Une playlist privée qui n'appartient pas au demandeur renvoie le MÊME
        // résultat qu'une playlist inexistante — voir explication en tête de réponse.
        if (!playlist || (!playlist.estPublique && !playlist.estProprietaire(requesterId))) {
            throw new PlaylistNotFoundError(id);
        }
        const trackCount = await this.playlistTrackRepository.count(id);
        return { playlist, trackCount };
    }

    async listMine(proprietaireId: string): Promise<PlaylistWithCount[]> {
        const playlists = await this.playlistRepository.findByProprietaire(proprietaireId);
        const result: PlaylistWithCount[] = [];
        for (const playlist of playlists) {
            const trackCount = await this.playlistTrackRepository.count(playlist.id);
            result.push({ playlist, trackCount });
        }
        return result;
    }

    async update(id: string, requesterId: string, nom?: string, visibilite?: Visibilite): Promise<PlaylistWithCount> {
        const { playlist } = await this.getById(id, requesterId); // gère déjà le 404 "masqué"
        if (!playlist.estProprietaire(requesterId)) {
            throw new ForbiddenError('Vous ne pouvez modifier que vos propres playlists.');
        }
        if (nom !== undefined) playlist.renommer(nom);
        if (visibilite !== undefined) playlist.changerVisibilite(visibilite);
        const saved = await this.playlistRepository.save(playlist);
        const trackCount = await this.playlistTrackRepository.count(id);
        return { playlist: saved, trackCount };
    }

    async remove(id: string, requesterId: string): Promise<void> {
        const { playlist } = await this.getById(id, requesterId);
        if (!playlist.estProprietaire(requesterId)) {
            throw new ForbiddenError('Vous ne pouvez supprimer que vos propres playlists.');
        }
        await this.playlistRepository.delete(id);
    }

    async listTracks(playlistId: string, requesterId: string): Promise<{ track: Track; ordre: number }[]> {
        await this.getById(playlistId, requesterId); // vérifie l'accès (404 masqué si privée et pas proprio)
        const entries = await this.playlistTrackRepository.list(playlistId);
        const result: { track: Track; ordre: number }[] = [];
        for (const entry of entries) {
            const track = await this.trackRepository.findById(entry.titreId);
            if (track) result.push({ track, ordre: entry.ordre });
        }
        return result;
    }

    async addTrack(playlistId: string, requesterId: string, titreId: string): Promise<void> {
        const { playlist } = await this.getById(playlistId, requesterId);
        if (!playlist.estProprietaire(requesterId)) {
            throw new ForbiddenError("Vous ne pouvez ajouter des titres qu'à vos propres playlists.");
        }

        const track = await this.trackRepository.findById(titreId);
        if (!track) throw new TrackNotFoundError(titreId);

        const dejaPresent = await this.playlistTrackRepository.isPresent(playlistId, titreId);
        if (dejaPresent) throw new TitreDejaDansPlaylistError();

        const maxOrdre = await this.playlistTrackRepository.getMaxOrdre(playlistId);
        await this.playlistTrackRepository.add(playlistId, titreId, maxOrdre + 1);
    }

    async removeTrack(playlistId: string, requesterId: string, titreId: string): Promise<void> {
        const { playlist } = await this.getById(playlistId, requesterId);
        if (!playlist.estProprietaire(requesterId)) {
            throw new ForbiddenError("Vous ne pouvez retirer des titres que de vos propres playlists.");
        }
        const present = await this.playlistTrackRepository.isPresent(playlistId, titreId);
        if (!present) throw new TitreAbsentDePlaylistError();
        await this.playlistTrackRepository.remove(playlistId, titreId);
    }

    async reorderTrack(playlistId: string, requesterId: string, titreId: string, versPosition: number): Promise<void> {
        const { playlist } = await this.getById(playlistId, requesterId);
        if (!playlist.estProprietaire(requesterId)) {
            throw new ForbiddenError("Vous ne pouvez réordonner que vos propres playlists.");
        }
        const entries = await this.playlistTrackRepository.list(playlistId);
        const present = entries.some((e) => e.titreId === titreId);
        if (!present) throw new TitreAbsentDePlaylistError();

        const nouvelOrdre = reorderTracks(entries, titreId, versPosition); // fonction pure, voir domain/
        await this.playlistTrackRepository.reorderAll(playlistId, nouvelOrdre);
    }
}