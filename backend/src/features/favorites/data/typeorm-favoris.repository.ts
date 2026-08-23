import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavorisRepository } from '../domain/favoris.repository';
import { FavoriOrmEntity } from './orm/favori.orm-entity';
import { AlbumFavoriOrmEntity } from './orm/album-favori.orm-entity';

@Injectable()
export class TypeOrmFavorisRepository implements FavorisRepository {
    constructor(
        @InjectRepository(FavoriOrmEntity)
        private readonly favoriRepo: Repository<FavoriOrmEntity>,
        @InjectRepository(AlbumFavoriOrmEntity)
        private readonly albumFavoriRepo: Repository<AlbumFavoriOrmEntity>,
    ) {}

    async isTitreFavori(utilisateurId: string, titreId: string): Promise<boolean> {
        const count = await this.favoriRepo.count({ where: { utilisateurId, titreId } });
        return count > 0;
    }

    async addTitreFavori(utilisateurId: string, titreId: string): Promise<void> {
        // Idempotent : ajouter un favori déjà existant ne doit pas planter sur
        // la contrainte de clé primaire composite, juste ne rien faire.
        if (await this.isTitreFavori(utilisateurId, titreId)) return;
        const entity = new FavoriOrmEntity();
        entity.utilisateurId = utilisateurId;
        entity.titreId = titreId;
        entity.dateAjout = new Date();
        await this.favoriRepo.save(entity);
    }

    async removeTitreFavori(utilisateurId: string, titreId: string): Promise<void> {
        // Idempotent également : supprimer un favori déjà absent ne renvoie
        // pas d'erreur (comportement DELETE standard, pas de vérification préalable).
        await this.favoriRepo.delete({ utilisateurId, titreId });
    }

    async listTitreIdsFavoris(utilisateurId: string): Promise<string[]> {
        const rows = await this.favoriRepo.find({ where: { utilisateurId }, order: { dateAjout: 'DESC' } });
        return rows.map((r) => r.titreId);
    }

    async isAlbumFavori(utilisateurId: string, albumId: string): Promise<boolean> {
        const count = await this.albumFavoriRepo.count({ where: { utilisateurId, albumId } });
        return count > 0;
    }

    async addAlbumFavori(utilisateurId: string, albumId: string): Promise<void> {
        if (await this.isAlbumFavori(utilisateurId, albumId)) return;
        const entity = new AlbumFavoriOrmEntity();
        entity.utilisateurId = utilisateurId;
        entity.albumId = albumId;
        entity.dateAjout = new Date();
        await this.albumFavoriRepo.save(entity);
    }

    async removeAlbumFavori(utilisateurId: string, albumId: string): Promise<void> {
        await this.albumFavoriRepo.delete({ utilisateurId, albumId });
    }

    async listAlbumIdsFavoris(utilisateurId: string): Promise<string[]> {
        const rows = await this.albumFavoriRepo.find({ where: { utilisateurId }, order: { dateAjout: 'DESC' } });
        return rows.map((r) => r.albumId);
    }
}