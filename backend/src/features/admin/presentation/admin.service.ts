import { Inject, Injectable } from '@nestjs/common';
import { UTILISATEUR_REPOSITORY, Utilisateur, UtilisateurNotFoundError } from '../../users';
import type { UtilisateurRepository } from '../../users';
import { TRACK_REPOSITORY } from '../../catalog-tracks';
import type { TrackRepository } from '../../catalog-tracks';

const NOMBRE_TITRES_POPULAIRES = 5;

export interface AdminStats {
    totalUtilisateurs: number;
    totalTitres: number;
    totalEcoutes: number;
    titresPopulaires: { id: string; titre: string; artisteId: string; nombreEcoutes: number }[];
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
        const titresPopulaires = [...titresValides]
            .sort((a, b) => b.nombreEcoutes - a.nombreEcoutes)
            .slice(0, NOMBRE_TITRES_POPULAIRES)
            .map((t) => ({ id: t.id, titre: t.titre, artisteId: t.artisteId, nombreEcoutes: t.nombreEcoutes }));

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
}