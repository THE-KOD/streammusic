import { Inject, Injectable } from '@nestjs/common';
import { FAVORIS_REPOSITORY } from '../domain/favoris.repository';
import type { FavorisRepository } from '../domain/favoris.repository';
import { TRACK_REPOSITORY, Track, TrackNotFoundError } from '../../catalog-tracks';
import type { TrackRepository } from '../../catalog-tracks';
import { ALBUM_REPOSITORY, Album, AlbumNotFoundError } from '../../catalog-albums';
import type { AlbumRepository } from '../../catalog-albums';

@Injectable()
export class FavoritesService {
    constructor(
        @Inject(FAVORIS_REPOSITORY) private readonly favorisRepository: FavorisRepository,
        @Inject(TRACK_REPOSITORY) private readonly trackRepository: TrackRepository,
        @Inject(ALBUM_REPOSITORY) private readonly albumRepository: AlbumRepository,
    ) {}

    async addTrack(utilisateurId: string, titreId: string): Promise<void> {
        // On vérifie que le titre existe réellement avant de l'ajouter en
        // favori — miroir applicatif de la contrainte FK favori.titre_id.
        const track = await this.trackRepository.findById(titreId);
        if (!track) throw new TrackNotFoundError(titreId);
        await this.favorisRepository.addTitreFavori(utilisateurId, titreId);
    }

    async removeTrack(utilisateurId: string, titreId: string): Promise<void> {
        await this.favorisRepository.removeTitreFavori(utilisateurId, titreId);
    }

    async listTracks(utilisateurId: string): Promise<Track[]> {
        const ids = await this.favorisRepository.listTitreIdsFavoris(utilisateurId);
        // Résout chaque id en objet Track complet — une requête par titre,
        // acceptable tant que la bibliothèque d'un utilisateur reste petite
        // (même compromis assumé que dans catalog-artists.list()).
        const tracks = await Promise.all(ids.map((id) => this.trackRepository.findById(id)));
        return tracks.filter((t): t is Track => t !== null);
    }

    async addAlbum(utilisateurId: string, albumId: string): Promise<void> {
        const album = await this.albumRepository.findById(albumId);
        if (!album) throw new AlbumNotFoundError(albumId);
        await this.favorisRepository.addAlbumFavori(utilisateurId, albumId);
    }

    async removeAlbum(utilisateurId: string, albumId: string): Promise<void> {
        await this.favorisRepository.removeAlbumFavori(utilisateurId, albumId);
    }

    async listAlbums(utilisateurId: string): Promise<Album[]> {
        const ids = await this.favorisRepository.listAlbumIdsFavoris(utilisateurId);
        const albums = await Promise.all(ids.map((id) => this.albumRepository.findById(id)));
        return albums.filter((a): a is Album => a !== null);
    }
}