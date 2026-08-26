import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'administrateur' })
export class AdministrateurOrmEntity {
    @PrimaryColumn({ type: 'char', length: 36 })
    id: string;

    @Column({ name: 'niveau_acces', type: 'varchar', length: 50, default: 'STANDARD' })
    niveauAcces: string;
}