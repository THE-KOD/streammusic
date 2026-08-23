import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'file_attente' })
export class FileAttenteOrmEntity {
    @PrimaryColumn({ type: 'char', length: 36 })
    id: string;

    @Column({ name: 'utilisateur_id', type: 'char', length: 36, unique: true })
    utilisateurId: string;
}