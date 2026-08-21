import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ALBUM_REPOSITORY } from '../domain/album.repository';
import type { AlbumRepository } from '../domain/album.repository';
import { Album } from '../domain/album.entity';
import { AlbumNotFoundError } from '../domain/errors';
import { ARTISTE_REPOSITORY, ArtisteNotFoundError } from '../../catalog-artists';
import type { ArtisteRepository } from '../../catalog-artists';
import { ForbiddenError } from '../../../core/errors';

@Injectable()
export class AlbumsService {
    constructor(
        @Inject(ALBUM_REPOSITORY) private readonly albumRepository: AlbumRepository,
        @Inject(ARTISTE_REPOSITORY) private readonly artisteRepository: ArtisteRepository,
    ) {}

    async create(artisteId: string, titre: string, dateSortie: string, pochetteUrl?: string): Promise<Album> {
        // Vérifie que l'artiste existe réellement — miroir applicatif de la
        // contrainte FK album.artiste_id, mais avec une erreur 404 exploitable
        // côté client plutôt qu'une erreur SQL brute de clé étrangère.
        const artisteExiste = await this.artisteRepository.existsById(artisteId);
        if (!artisteExiste) throw new ArtisteNotFoundError(artisteId);

        const album = Album.create({
            id: randomUUID(),
            artisteId,
            titre,
            pochetteUrl: pochetteUrl ?? null,
            dateSortie,
        });
        return this.albumRepository.save(album);
    }

    async getById(id: string): Promise<Album> {
        const album = await this.albumRepository.findById(id);
        if (!album) throw new AlbumNotFoundError(id);
        return album;
    }

    list(): Promise<Album[]> {
        return this.albumRepository.findAll();
    }

    listByArtiste(artisteId: string): Promise<Album[]> {
        return this.albumRepository.findByArtisteId(artisteId);
    }

    async update(id: string, connecteId: string, titre?: string, pochetteUrl?: string): Promise<Album> {
        const album = await this.getById(id); // 404 si l'album n'existe pas du tout

        // Règle "propriétaire uniquement" — l'exception pour un admin viendra
        // avec le RolesGuard du module admin (étape 9), pas encore construit.
        if (album.artisteId !== connecteId) {
            throw new ForbiddenError("Vous ne pouvez modifier qu'un album de votre propre catalogue.");
        }
        if (titre !== undefined) album.renommer(titre);
        if (pochetteUrl !== undefined) album.modifierPochette(pochetteUrl);
        return this.albumRepository.save(album);
    }

    async remove(id: string, connecteId: string): Promise<void> {
        const album = await this.getById(id);
        if (album.artisteId !== connecteId) {
            throw new ForbiddenError("Vous ne pouvez supprimer qu'un album de votre propre catalogue.");
        }
        await this.albumRepository.delete(id);
    }
}