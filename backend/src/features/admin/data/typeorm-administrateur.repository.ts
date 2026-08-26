import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdministrateurRepository } from '../domain/administrateur.repository';
import { Administrateur } from '../domain/administrateur.entity';
import { AdministrateurOrmEntity } from './orm/administrateur.orm-entity';

@Injectable()
export class TypeOrmAdministrateurRepository implements AdministrateurRepository {
    constructor(
        @InjectRepository(AdministrateurOrmEntity)
        private readonly repo: Repository<AdministrateurOrmEntity>,
    ) {}

    async existsById(utilisateurId: string): Promise<boolean> {
        const count = await this.repo.count({ where: { id: utilisateurId } });
        return count > 0;
    }

    async findById(utilisateurId: string): Promise<Administrateur | null> {
        const orm = await this.repo.findOne({ where: { id: utilisateurId } });
        return orm ? Administrateur.create({ id: orm.id, niveauAcces: orm.niveauAcces }) : null;
    }
}