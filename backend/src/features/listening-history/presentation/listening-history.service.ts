import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { HISTORIQUE_REPOSITORY } from '../domain/historique.repository';
import type { HistoriqueRepository } from '../domain/historique.repository';
import { HistoriqueEcoute } from '../domain/historique-ecoute.entity';
import { TRACK_REPOSITORY, Track, TrackNotFoundError } from '../../catalog-tracks';
import type { TrackRepository } from '../../catalog-tracks';

@Injectable()
export class ListeningHistoryService {
    constructor(
        @Inject(HISTORIQUE_REPOSITORY) private readonly historiqueRepository: HistoriqueRepository,
        @Inject(TRACK_REPOSITORY) private readonly trackRepository: TrackRepository,
    ) {}

    async logListen(utilisateurId: string, titreId: string, dureeEcoutee: number): Promise<{ entry: HistoriqueEcoute; track: Track }> {
        const track = await this.trackRepository.findById(titreId);
        if (!track) throw new TrackNotFoundError(titreId);

        const entry = HistoriqueEcoute.create(
            { id: randomUUID(), utilisateurId, titreId, dateEcoute: new Date(), dureeEcoutee },
            track.duree,
        );
        const savedEntry = await this.historiqueRepository.save(entry);

        track.incrementerEcoutes();
        const savedTrack = await this.trackRepository.save(track);

        return { entry: savedEntry, track: savedTrack };
    }

    async listMine(utilisateurId: string, limit = 50): Promise<{ entry: HistoriqueEcoute; track: Track }[]> {
        const entries = await this.historiqueRepository.listByUtilisateur(utilisateurId, limit);
        const result: { entry: HistoriqueEcoute; track: Track }[] = [];
        for (const entry of entries) {
            const track = await this.trackRepository.findById(entry.titreId);
            if (track) result.push({ entry, track });
        }
        return result;
    }

    async clearMine(utilisateurId: string): Promise<void> {
        await this.historiqueRepository.clearForUtilisateur(utilisateurId);
    }
}