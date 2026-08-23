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

    async logListen(utilisateurId: string, titreId: string, dureeEcoutee: number): Promise<HistoriqueEcoute> {
        const track = await this.trackRepository.findById(titreId);
        if (!track) throw new TrackNotFoundError(titreId);

        // create() (pas reconstruct()) : on est bien en train d'ÉCRIRE un nouvel
        // enregistrement, la validation dureeEcoutee <= track.duree s'applique.
        const entry = HistoriqueEcoute.create(
            { id: randomUUID(), utilisateurId, titreId, dateEcoute: new Date(), dureeEcoutee },
            track.duree,
        );
        const saved = await this.historiqueRepository.save(entry);

        // Effet de bord assumé : logger une écoute incrémente le compteur public
        // du titre — c'est ce compteur qui alimente le classement du dashboard admin.
        track.incrementerEcoutes();
        await this.trackRepository.save(track);

        return saved;
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