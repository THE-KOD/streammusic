import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { QueueRepository, QueueTrackEntry } from '../domain/queue.repository';
import { FileAttenteOrmEntity } from './orm/file-attente.orm-entity';
import { FileAttenteTitreOrmEntity } from './orm/file-attente-titre.orm-entity';

@Injectable()
export class TypeOrmQueueRepository implements QueueRepository {
    constructor(
        @InjectRepository(FileAttenteOrmEntity) private readonly fileRepo: Repository<FileAttenteOrmEntity>,
        @InjectRepository(FileAttenteTitreOrmEntity) private readonly titreRepo: Repository<FileAttenteTitreOrmEntity>,
    ) {}

    async findFileIdByUtilisateur(utilisateurId: string): Promise<string | null> {
        const orm = await this.fileRepo.findOne({ where: { utilisateurId } });
        return orm ? orm.id : null;
    }

    async createFile(utilisateurId: string): Promise<string> {
        const entity = new FileAttenteOrmEntity();
        entity.id = randomUUID(); // généré ici explicitement, pas de @BeforeInsert : createFile() doit renvoyer l'id immédiatement.
        entity.utilisateurId = utilisateurId;
        const saved = await this.fileRepo.save(entity);
        return saved.id;
    }

    async list(fileId: string): Promise<QueueTrackEntry[]> {
        const rows = await this.titreRepo.find({ where: { fileId }, order: { ordre: 'ASC' } });
        return rows.map((r) => ({ titreId: r.titreId, ordre: r.ordre }));
    }

    async isPresent(fileId: string, titreId: string): Promise<boolean> {
        const count = await this.titreRepo.count({ where: { fileId, titreId } });
        return count > 0;
    }

    async getMaxOrdre(fileId: string): Promise<number> {
        const rows = await this.titreRepo.find({ where: { fileId }, order: { ordre: 'DESC' }, take: 1 });
        return rows.length > 0 ? rows[0].ordre : 0;
    }

    async add(fileId: string, titreId: string, ordre: number): Promise<void> {
        const entity = new FileAttenteTitreOrmEntity();
        entity.fileId = fileId;
        entity.titreId = titreId;
        entity.ordre = ordre;
        await this.titreRepo.save(entity);
    }

    async remove(fileId: string, titreId: string): Promise<void> {
        await this.titreRepo.delete({ fileId, titreId });
    }

    async reorderAll(fileId: string, entries: QueueTrackEntry[]): Promise<void> {
        for (const entry of entries) {
            await this.titreRepo.update({ fileId, titreId: entry.titreId }, { ordre: entry.ordre });
        }
    }

    async clear(fileId: string): Promise<void> {
        await this.titreRepo.delete({ fileId });
    }
}