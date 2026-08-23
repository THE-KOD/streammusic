import { Inject, Injectable } from '@nestjs/common';
import { QUEUE_REPOSITORY } from '../domain/queue.repository';
import type { QueueRepository } from '../domain/queue.repository';
import { TitreDejaDansFileError, TitreAbsentDeFileError } from '../domain/errors';
import { reorderList } from '../../../shared/utils/reorder-list';
import { TRACK_REPOSITORY, Track, TrackNotFoundError } from '../../catalog-tracks';
import type { TrackRepository } from '../../catalog-tracks';

@Injectable()
export class QueueService {
    constructor(
        @Inject(QUEUE_REPOSITORY) private readonly queueRepository: QueueRepository,
        @Inject(TRACK_REPOSITORY) private readonly trackRepository: TrackRepository,
    ) {}

    // Renvoie l'id de la file, en la créant si c'est le tout premier ajout —
    // création paresseuse, voir note en tête de réponse.
    private async getOrCreateFileId(utilisateurId: string): Promise<string> {
        const existing = await this.queueRepository.findFileIdByUtilisateur(utilisateurId);
        if (existing) return existing;
        return this.queueRepository.createFile(utilisateurId);
    }

    async list(utilisateurId: string): Promise<{ track: Track; ordre: number }[]> {
        const fileId = await this.queueRepository.findFileIdByUtilisateur(utilisateurId);
        if (!fileId) return []; // pas encore de file = liste vide, pas une erreur

        const entries = await this.queueRepository.list(fileId);
        const result: { track: Track; ordre: number }[] = [];
        for (const entry of entries) {
            const track = await this.trackRepository.findById(entry.titreId);
            if (track) result.push({ track, ordre: entry.ordre });
        }
        return result;
    }

    async addTrack(utilisateurId: string, titreId: string): Promise<void> {
        const track = await this.trackRepository.findById(titreId);
        if (!track) throw new TrackNotFoundError(titreId);

        const fileId = await this.getOrCreateFileId(utilisateurId);
        const dejaPresent = await this.queueRepository.isPresent(fileId, titreId);
        if (dejaPresent) throw new TitreDejaDansFileError();

        const maxOrdre = await this.queueRepository.getMaxOrdre(fileId);
        await this.queueRepository.add(fileId, titreId, maxOrdre + 1);
    }

    async removeTrack(utilisateurId: string, titreId: string): Promise<void> {
        const fileId = await this.queueRepository.findFileIdByUtilisateur(utilisateurId);
        if (!fileId) throw new TitreAbsentDeFileError();
        const present = await this.queueRepository.isPresent(fileId, titreId);
        if (!present) throw new TitreAbsentDeFileError();
        await this.queueRepository.remove(fileId, titreId);
    }

    async reorderTrack(utilisateurId: string, titreId: string, versPosition: number): Promise<void> {
        const fileId = await this.queueRepository.findFileIdByUtilisateur(utilisateurId);
        if (!fileId) throw new TitreAbsentDeFileError();

        const entries = await this.queueRepository.list(fileId);
        const present = entries.some((e) => e.titreId === titreId);
        if (!present) throw new TitreAbsentDeFileError();

        const genericEntries = entries.map((e) => ({ id: e.titreId, ordre: e.ordre }));
        const reordered = reorderList(genericEntries, titreId, versPosition);
        const nouvelOrdre = reordered.map((e) => ({ titreId: e.id, ordre: e.ordre }));
        await this.queueRepository.reorderAll(fileId, nouvelOrdre);
    }

    async clear(utilisateurId: string): Promise<void> {
        const fileId = await this.queueRepository.findFileIdByUtilisateur(utilisateurId);
        if (!fileId) return; // rien à vider, pas une erreur
        await this.queueRepository.clear(fileId);
    }
}