import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'file_attente_titre' })
export class FileAttenteTitreOrmEntity {
    @PrimaryColumn({ name: 'file_id', type: 'char', length: 36 })
    fileId: string;

    @PrimaryColumn({ name: 'titre_id', type: 'char', length: 36 })
    titreId: string;

    @Column({ type: 'int' })
    ordre: number;
}