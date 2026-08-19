import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { GENRE_REPOSITORY } from '../domain/genre.repository';
import type { GenreRepository } from '../domain/genre.repository';
import { Genre } from '../domain/genre.entity';
import { GenreNotFoundError, GenreNomDejaUtiliseError } from '../domain/errors';

@Injectable()
export class GenresService {
    constructor(
        @Inject(GENRE_REPOSITORY) private readonly genreRepository: GenreRepository,
    ) {}

    list(): Promise<Genre[]> {
        return this.genreRepository.findAll();
    }

    async getById(id: string): Promise<Genre> {
        const genre = await this.genreRepository.findById(id);
        if (!genre) throw new GenreNotFoundError(id);
        return genre;
    }

    async create(nom: string): Promise<Genre> {
        // Vérification applicative en plus de la contrainte UNIQUE de la base :
        // permet de renvoyer une erreur métier claire (409 + message) plutôt
        // que de laisser remonter une erreur SQL brute au client.
        const existant = await this.genreRepository.findByNom(nom.trim());
        if (existant) throw new GenreNomDejaUtiliseError(nom);

        const genre = Genre.create({ id: randomUUID(), nom });
        return this.genreRepository.save(genre);
    }

    async update(id: string, nom: string): Promise<Genre> {
        const genre = await this.getById(id); // lève GenreNotFoundError si absent

        // On ne vérifie l'unicité que si le nom change réellement —
        // sinon renommer "Pop" en "Pop" échouerait à tort (il existe déjà : lui-même).
        if (nom.trim() !== genre.nom) {
            const existant = await this.genreRepository.findByNom(nom.trim());
            if (existant) throw new GenreNomDejaUtiliseError(nom);
        }

        genre.renommer(nom);
        return this.genreRepository.save(genre);
    }

    async remove(id: string): Promise<void> {
        await this.getById(id); // 404 propre si l'id n'existe pas du tout
        await this.genreRepository.delete(id); // peut lever GenreEnUsageError (voir repository)
    }
}