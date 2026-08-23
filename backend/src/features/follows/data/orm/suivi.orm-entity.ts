import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'suivi' })
export class SuiviOrmEntity {
    @PrimaryColumn({ name: 'follower_id', type: 'char', length: 36 })
    followerId: string;

    @PrimaryColumn({ name: 'artiste_id', type: 'char', length: 36 })
    artisteId: string;

    @Column({ name: 'date_suivi', type: 'datetime' })
    dateSuivi: Date;
}