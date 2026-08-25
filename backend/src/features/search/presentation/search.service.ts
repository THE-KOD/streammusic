import { Inject, Injectable } from '@nestjs/common';
import { TRACK_SEARCH_REPOSITORY } from '../domain/track-search.repository';
import type { TrackSearchRepository, TrackSearchFilters, TrackSearchDocument } from '../domain/track-search.repository';
import { ARTISTE_REPOSITORY } from '../../catalog-artists';
import type { ArtisteRepository } from '../../catalog-artists';
import { ALBUM_REPOSITORY, Album } from '../../catalog-albums';
import type { AlbumRepository } from '../../catalog-albums';
import { UTILISATEUR_REPOSITORY } from '../../users';
import type { UtilisateurRepository } from '../../users';

export interface ArtistSearchResult {
    id: string;
    pseudo: string;
}

export interface SearchResult {
    tracks: TrackSearchDocument[];
    artists: ArtistSearchResult[];
    albums: Album[];
}

@Injectable()
export class SearchService {
    constructor(
        @Inject(TRACK_SEARCH_REPOSITORY) private readonly trackSearchRepository: TrackSearchRepository,
        @Inject(ARTISTE_REPOSITORY) private readonly artisteRepository: ArtisteRepository,
        @Inject(UTILISATEUR_REPOSITORY) private readonly utilisateurRepository: UtilisateurRepository,
        @Inject(ALBUM_REPOSITORY) private readonly albumRepository: AlbumRepository,
    ) {}

    async search(query: string, filters: TrackSearchFilters): Promise<SearchResult> {
        const [tracks, artists, albums] = await Promise.all([
            this.trackSearchRepository.search(query, filters),
            this.searchArtists(query),
            this.searchAlbums(query),
        ]);
        return { tracks, artists, albums };
    }

    // Recherche par sous-chaîne en mémoire — voir la justification de ce choix
    // (vs MeiliSearch) en tête de réponse. Acceptable tant que le nombre
    // d'artistes reste petit, même compromis assumé qu'ailleurs dans le catalogue.
    private async searchArtists(query: string): Promise<ArtistSearchResult[]> {
        const lower = query.toLowerCase();
        const all = await this.artisteRepository.findAll();
        const result: ArtistSearchResult[] = [];
        for (const artiste of all) {
            const utilisateur = await this.utilisateurRepository.findById(artiste.id);
            if (utilisateur && utilisateur.pseudo.toLowerCase().includes(lower)) {
                result.push({ id: artiste.id, pseudo: utilisateur.pseudo });
            }
        }
        return result;
    }

    private async searchAlbums(query: string): Promise<Album[]> {
        const lower = query.toLowerCase();
        const all = await this.albumRepository.findAll();
        return all.filter((a) => a.titre.toLowerCase().includes(lower));
    }
}