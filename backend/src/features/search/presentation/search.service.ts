import { Inject, Injectable } from '@nestjs/common';
import { TRACK_SEARCH_REPOSITORY } from '../domain/track-search.repository';
import type { TrackSearchRepository, TrackSearchFilters, TrackSearchDocument } from '../domain/track-search.repository';
import { ARTISTE_REPOSITORY } from '../../catalog-artists';
import type { ArtisteRepository } from '../../catalog-artists';
import { ALBUM_REPOSITORY } from '../../catalog-albums';
import type { AlbumRepository } from '../../catalog-albums';
import { UTILISATEUR_REPOSITORY } from '../../users';
import type { UtilisateurRepository } from '../../users';

export interface ArtistSearchResult {
    id: string;
    pseudo: string;
    photoArtisteUrl: string | null;
}

export interface AlbumSearchResult {
    id: string;
    titre: string;
    artisteId: string;
    artisteNom: string;
    pochetteUrl: string | null;
    dateSortie: string;
}

export interface SearchResult {
    tracks: TrackSearchDocument[];
    artists: ArtistSearchResult[];
    albums: AlbumSearchResult[];
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

    private async searchArtists(query: string): Promise<ArtistSearchResult[]> {
        const lower = query.toLowerCase();
        const all = await this.artisteRepository.findAll();
        const result: ArtistSearchResult[] = [];
        for (const artiste of all) {
            const utilisateur = await this.utilisateurRepository.findById(artiste.id);
            if (utilisateur && utilisateur.pseudo.toLowerCase().includes(lower)) {
                result.push({ id: artiste.id, pseudo: utilisateur.pseudo, photoArtisteUrl: artiste.photoArtisteUrl });
            }
        }
        return result;
    }

    private async searchAlbums(query: string): Promise<AlbumSearchResult[]> {
        const lower = query.toLowerCase();
        const all = await this.albumRepository.findAll();
        const matched = all.filter((a) => a.titre.toLowerCase().includes(lower));
        const result: AlbumSearchResult[] = [];
        for (const album of matched) {
            const utilisateur = await this.utilisateurRepository.findById(album.artisteId);
            result.push({
                id: album.id, titre: album.titre, artisteId: album.artisteId,
                artisteNom: utilisateur?.pseudo ?? 'Artiste inconnu', pochetteUrl: album.pochetteUrl, dateSortie: album.dateSortie,
            });
        }
        return result;
    }
}