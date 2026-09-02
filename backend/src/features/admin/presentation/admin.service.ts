import { Inject, Injectable } from '@nestjs/common';
import { UTILISATEUR_REPOSITORY, Utilisateur, UtilisateurNotFoundError } from '../../users';
import type { UtilisateurRepository } from '../../users';
import { TRACK_REPOSITORY, Track } from '../../catalog-tracks';
import type { TrackRepository } from '../../catalog-tracks';

const NOMBRE_TITRES_POPULAIRES = 5;
const STATUTS_VALIDES = ['EN_ATTENTE', 'VALIDE', 'REJETE'] as const;
type StatutModeration = (typeof STATUTS_VALIDES)[number];

// Une valeur de query string inconnue est simplement ignorée (pas de filtre)
// plutôt que de faire planter la requête — comportement raisonnable pour
// un paramètre de filtre optionnel.
function toStatutValide(value?: string): StatutModeration | undefined {
    return STATUTS_VALIDES.includes(value as StatutModeration) ? (value as StatutModeration) : undefined;
}

export interface AdminStats {
    totalUtilisateurs: number;
    totalTitres: number;
    totalEcoutes: number;
    titresPopulaires: { id: string; titre: string; artisteId: string; artisteNom: string; nombreEcoutes: number }[];
}

@Injectable()
export class AdminService {
    constructor(
        @Inject(UTILISATEUR_REPOSITORY) private readonly utilisateurRepository: UtilisateurRepository,
        @Inject(TRACK_REPOSITORY) private readonly trackRepository: TrackRepository,
    ) {}

    async getStats(): Promise<AdminStats> {
        const [totalUtilisateurs, titresValides] = await Promise.all([
            this.utilisateurRepository.countAll(),
            this.trackRepository.findAllValide(),
        ]);

        const totalEcoutes = titresValides.reduce((somme, t) => somme + t.nombreEcoutes, 0);
        const topRaw = [...titresValides].sort((a, b) => b.nombreEcoutes - a.nombreEcoutes).slice(0, NOMBRE_TITRES_POPULAIRES);

        const titresPopulaires = await Promise.all(
            topRaw.map(async (t) => {
                const utilisateur = await this.utilisateurRepository.findById(t.artisteId);
                return { id: t.id, titre: t.titre, artisteId: t.artisteId, artisteNom: utilisateur?.pseudo ?? 'Artiste inconnu', nombreEcoutes: t.nombreEcoutes };
            }),
        );

        return { totalUtilisateurs, totalTitres: titresValides.length, totalEcoutes, titresPopulaires };
    }

    listUsers(): Promise<Utilisateur[]> {
        return this.utilisateurRepository.findAll();
    }

    async suspendUser(userId: string): Promise<Utilisateur> {
        const utilisateur = await this.utilisateurRepository.findById(userId);
        if (!utilisateur) throw new UtilisateurNotFoundError(userId);
        utilisateur.suspendre();
        return this.utilisateurRepository.save(utilisateur);
    }

    async reactivateUser(userId: string): Promise<Utilisateur> {
        const utilisateur = await this.utilisateurRepository.findById(userId);
        if (!utilisateur) throw new UtilisateurNotFoundError(userId);
        utilisateur.reactiver();
        return this.utilisateurRepository.save(utilisateur);
    }

    async deleteUser(userId: string): Promise<void> {
        const utilisateur = await this.utilisateurRepository.findById(userId);
        if (!utilisateur) throw new UtilisateurNotFoundError(userId);
        await this.utilisateurRepository.delete(userId);
    }

    listTracksForModeration(statut?: string): Promise<Track[]> {
        return this.trackRepository.findAllForModeration(toStatutValide(statut));
    }
}