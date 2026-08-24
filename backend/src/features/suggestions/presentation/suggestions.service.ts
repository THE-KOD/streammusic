import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SUGGESTION_REPOSITORY } from '../domain/suggestion.repository';
import type { SuggestionRepository } from '../domain/suggestion.repository';
import { Suggestion } from '../domain/suggestion.entity';
import { TRACK_REPOSITORY, Track } from '../../catalog-tracks';
import type { TrackRepository } from '../../catalog-tracks';
import { HISTORIQUE_REPOSITORY } from '../../listening-history';
import type { HistoriqueRepository } from '../../listening-history';

const NOMBRE_SUGGESTIONS = 10;
const TAILLE_HISTORIQUE_ANALYSE = 100; // dernières écoutes prises en compte
const SCORE_FALLBACK_POPULARITE = 0.1; // score volontairement bas : pas une vraie personnalisation

@Injectable()
export class SuggestionsService {
    constructor(
        @Inject(SUGGESTION_REPOSITORY) private readonly suggestionRepository: SuggestionRepository,
        @Inject(TRACK_REPOSITORY) private readonly trackRepository: TrackRepository,
        @Inject(HISTORIQUE_REPOSITORY) private readonly historiqueRepository: HistoriqueRepository,
    ) {}

    async listMine(utilisateurId: string): Promise<{ track: Track; score: number }[]> {
        const suggestions = await this.suggestionRepository.listByUtilisateur(utilisateurId);
        const result: { track: Track; score: number }[] = [];
        for (const s of suggestions) {
            const track = await this.trackRepository.findById(s.titreId);
            if (track) result.push({ track, score: s.score });
        }
        return result;
    }

    /**
     * Heuristique simple et honnête, pas un vrai moteur de ML : on regarde
     * les genres les plus présents dans l'historique récent, et on recommande
     * des titres validés de ces genres pas encore écoutés. Repli sur les titres
     * les plus populaires si aucun historique n'existe (nouvel utilisateur).
     */
    async regenerate(utilisateurId: string): Promise<{ track: Track; score: number }[]> {
        const historique = await this.historiqueRepository.listByUtilisateur(utilisateurId, TAILLE_HISTORIQUE_ANALYSE);
        if (historique.length === 0) return this.suggererParPopularite(utilisateurId);

        const titresDejaEcoutesIds = new Set(historique.map((h) => h.titreId));

        const frequenceParGenre = new Map<string, number>();
        for (const entry of historique) {
            const track = await this.trackRepository.findById(entry.titreId);
            if (!track) continue;
            frequenceParGenre.set(track.genreId, (frequenceParGenre.get(track.genreId) ?? 0) + 1);
        }
        if (frequenceParGenre.size === 0) return this.suggererParPopularite(utilisateurId);

        const totalEcoutes = historique.length;
        const candidats: { track: Track; score: number }[] = [];

        for (const [genreId, frequence] of frequenceParGenre) {
            const tracksDuGenre = await this.trackRepository.findAllValide({ genreId });
            const score = frequence / totalEcoutes; // proportion des écoutes dans ce genre — naturellement dans [0, 1]
            for (const track of tracksDuGenre) {
                if (titresDejaEcoutesIds.has(track.id)) continue;
                candidats.push({ track, score });
            }
        }

        const meilleurs = candidats.sort((a, b) => b.score - a.score).slice(0, NOMBRE_SUGGESTIONS);
        await this.persist(utilisateurId, meilleurs);
        return meilleurs;
    }

    private async suggererParPopularite(utilisateurId: string): Promise<{ track: Track; score: number }[]> {
        const tousLesTracks = await this.trackRepository.findAllValide();
        const populaires = [...tousLesTracks]
            .sort((a, b) => b.nombreEcoutes - a.nombreEcoutes)
            .slice(0, NOMBRE_SUGGESTIONS)
            .map((track) => ({ track, score: SCORE_FALLBACK_POPULARITE }));
        await this.persist(utilisateurId, populaires);
        return populaires;
    }

    private async persist(utilisateurId: string, entries: { track: Track; score: number }[]): Promise<void> {
        const suggestions = entries.map(({ track, score }) =>
            Suggestion.create({ id: randomUUID(), utilisateurId, titreId: track.id, score, dateGeneration: new Date() }),
        );
        await this.suggestionRepository.replaceAllForUtilisateur(utilisateurId, suggestions);
    }
}