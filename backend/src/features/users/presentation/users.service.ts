import { Inject, Injectable } from '@nestjs/common';
import { UTILISATEUR_REPOSITORY } from '../domain/user.repository';
import type { UtilisateurRepository } from '../domain/user.repository';
import { Utilisateur } from '../domain/user.entity';
import { UtilisateurNotFoundError, PseudoDejaUtiliseError } from '../domain/errors';

export interface UpdateProfileInput {
    pseudo?: string;
    photoProfilUrl?: string;
}

@Injectable()
export class UsersService {
    constructor(
        @Inject(UTILISATEUR_REPOSITORY) private readonly utilisateurRepository: UtilisateurRepository,
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
}