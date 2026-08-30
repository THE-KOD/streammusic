import { Inject, Injectable } from '@nestjs/common';
import { UTILISATEUR_REPOSITORY } from '../domain/user.repository';
import type { UtilisateurRepository } from '../domain/user.repository';
import { Utilisateur } from '../domain/user.entity';
import { UtilisateurNotFoundError, PseudoDejaUtiliseError } from '../domain/errors';
import { PREFERENCES_REPOSITORY } from '../domain/preferences.repository';
import type { PreferencesRepository } from '../domain/preferences.repository';
import { GENRE_REPOSITORY, GenreNotFoundError } from '../../catalog-genres';
import type { GenreRepository } from '../../catalog-genres';

export interface UpdateProfileInput {
    pseudo?: string;
    photoProfilUrl?: string;
}

@Injectable()
export class UsersService {
    constructor(
        @Inject(UTILISATEUR_REPOSITORY) private readonly utilisateurRepository: UtilisateurRepository,
        @Inject(PREFERENCES_REPOSITORY) private readonly preferencesRepository: PreferencesRepository,
        @Inject(GENRE_REPOSITORY) private readonly genreRepository: GenreRepository,
    ) {}

    async getProfile(utilisateurId: string): Promise<Utilisateur> {
        const utilisateur = await this.utilisateurRepository.findById(utilisateurId);
        if (!utilisateur) throw new UtilisateurNotFoundError(utilisateurId);
        return utilisateur;
    }

    async updateProfile(utilisateurId: string, input: UpdateProfileInput): Promise<Utilisateur> {
        const utilisateur = await this.getProfile(utilisateurId);

        if (input.pseudo && input.pseudo !== utilisateur.pseudo) {
            const existing = await this.utilisateurRepository.findByPseudo(input.pseudo);
            if (existing) throw new PseudoDejaUtiliseError(input.pseudo);
            utilisateur.pseudo = input.pseudo;
        }
        if (input.photoProfilUrl !== undefined) {
            utilisateur.photoProfilUrl = input.photoProfilUrl;
        }
        return this.utilisateurRepository.save(utilisateur);
    }

    getGenrePreferences(utilisateurId: string): Promise<string[]> {
        return this.preferencesRepository.listGenreIds(utilisateurId);
    }

    async updateGenrePreferences(utilisateurId: string, genreIds: string[]): Promise<string[]> {
        // Miroir applicatif de la contrainte FK genre_id — un genre inexistant
        // est rejeté avec une 404 claire plutôt qu'une erreur SQL brute.
        for (const id of genreIds) {
            const genre = await this.genreRepository.findById(id);
            if (!genre) throw new GenreNotFoundError(id);
        }
        await this.preferencesRepository.replaceGenres(utilisateurId, genreIds);
        return genreIds;
    }
}