import { Inject, Injectable } from '@nestjs/common';
import { FOLLOWS_REPOSITORY } from '../domain/follows.repository';
import type { FollowsRepository } from '../domain/follows.repository';
import { NeSuitPasSoiMemeError } from '../domain/errors';
import { ARTISTE_REPOSITORY, ArtisteNotFoundError } from '../../catalog-artists';
import type { ArtisteRepository } from '../../catalog-artists';
import { UTILISATEUR_REPOSITORY } from '../../users';
import type { UtilisateurRepository } from '../../users';

export interface FollowedArtiste {
    id: string;
    pseudo: string;
}

@Injectable()
export class FollowsService {
    constructor(
        @Inject(FOLLOWS_REPOSITORY) private readonly followsRepository: FollowsRepository,
        @Inject(ARTISTE_REPOSITORY) private readonly artisteRepository: ArtisteRepository,
        @Inject(UTILISATEUR_REPOSITORY) private readonly utilisateurRepository: UtilisateurRepository,
    ) {}

    async follow(followerId: string, artisteId: string): Promise<void> {
        if (followerId === artisteId) throw new NeSuitPasSoiMemeError();

        const existe = await this.artisteRepository.existsById(artisteId);
        if (!existe) throw new ArtisteNotFoundError(artisteId);

        await this.followsRepository.follow(followerId, artisteId);
    }

    async unfollow(followerId: string, artisteId: string): Promise<void> {
        await this.followsRepository.unfollow(followerId, artisteId);
    }

    isFollowing(followerId: string, artisteId: string): Promise<boolean> {
        return this.followsRepository.isFollowing(followerId, artisteId);
    }

    async listFollowed(followerId: string): Promise<FollowedArtiste[]> {
        const artisteIds = await this.followsRepository.listArtisteIdsFollowed(followerId);
        // Même compromis "une requête par élément" qu'ailleurs dans le catalogue —
        // acceptable tant que le nombre d'artistes suivis reste petit.
        const resultats: FollowedArtiste[] = [];
        for (const id of artisteIds) {
            const utilisateur = await this.utilisateurRepository.findById(id);
            if (utilisateur) resultats.push({ id, pseudo: utilisateur.pseudo });
        }
        return resultats;
    }
}