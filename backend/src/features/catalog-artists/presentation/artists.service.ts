import { Inject, Injectable } from '@nestjs/common';
import { ARTISTE_REPOSITORY } from '../domain/artiste.repository';
import type { ArtisteRepository } from '../domain/artiste.repository';
import { Artiste } from '../domain/artiste.entity';
import { ArtisteNotFoundError, DejaArtisteError } from '../domain/errors';
import { UTILISATEUR_REPOSITORY, UtilisateurNotFoundError } from '../../users';
import type { UtilisateurRepository } from '../../users';

// Type de retour combiné : les données propres à l'artiste + le pseudo
// emprunté à l'utilisateur — jamais stocké deux fois, toujours recomposé ici.
export interface ArtisteAvecPseudo {
    artiste: Artiste;
    pseudo: string;
}

@Injectable()
export class ArtistsService {
    constructor(
        @Inject(ARTISTE_REPOSITORY) private readonly artisteRepository: ArtisteRepository,
        @Inject(UTILISATEUR_REPOSITORY) private readonly utilisateurRepository: UtilisateurRepository,
    ) {}

    async devenirArtiste(
        utilisateurId: string,
        biographie?: string,
        photoArtisteUrl?: string,
    ): Promise<ArtisteAvecPseudo> {
        // 1) L'utilisateur doit exister (toujours vrai en pratique puisqu'on
        //    utilise l'id du token JWT, mais on le vérifie quand même — jamais
        //    faire confiance aveuglément à une donnée externe, même "sûre").
        const utilisateur = await this.utilisateurRepository.findById(utilisateurId);
        if (!utilisateur) throw new UtilisateurNotFoundError(utilisateurId);

        // 2) Un même compte ne peut devenir artiste qu'une seule fois.
        const dejaArtiste = await this.artisteRepository.existsById(utilisateurId);
        if (dejaArtiste) throw new DejaArtisteError(utilisateurId);

        const artiste = Artiste.create({
            id: utilisateurId, // <- le coeur du pattern "table par sous-classe"
            biographie: biographie ?? null,
            photoArtisteUrl: photoArtisteUrl ?? null,
        });
        const saved = await this.artisteRepository.save(artiste);
        return { artiste: saved, pseudo: utilisateur.pseudo };
    }

    async getById(id: string): Promise<ArtisteAvecPseudo> {
        const artiste = await this.artisteRepository.findById(id);
        if (!artiste) throw new ArtisteNotFoundError(id);

        const utilisateur = await this.utilisateurRepository.findById(id);
        // Ne devrait jamais arriver en pratique (ON DELETE CASCADE garantit que
        // l'artiste disparaît si l'utilisateur disparaît) — mais on se protège
        // quand même plutôt que de renvoyer un pseudo undefined au client.
        if (!utilisateur) throw new UtilisateurNotFoundError(id);

        return { artiste, pseudo: utilisateur.pseudo };
    }

    async list(): Promise<ArtisteAvecPseudo[]> {
        const artistes = await this.artisteRepository.findAll();
        // Une requête par artiste pour récupérer son pseudo — acceptable tant
        // que le catalogue reste petit (Phase 3). À optimiser en une seule
        // requête jointe (JOIN utilisateur) si le nombre d'artistes grossit.
        const resultats: ArtisteAvecPseudo[] = [];
        for (const artiste of artistes) {
            const utilisateur = await this.utilisateurRepository.findById(artiste.id);
            if (utilisateur) resultats.push({ artiste, pseudo: utilisateur.pseudo });
        }
        return resultats;
    }

    async updateProfile(id: string, biographie?: string, photoArtisteUrl?: string): Promise<ArtisteAvecPseudo> {
        const { artiste, pseudo } = await this.getById(id); // 404 si absent
        artiste.modifierProfil(biographie, photoArtisteUrl);
        const saved = await this.artisteRepository.save(artiste);
        return { artiste: saved, pseudo };
    }
}