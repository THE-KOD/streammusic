import { ApiProperty } from '@nestjs/swagger';

export class TrackResponseDto {
    @ApiProperty() id: string;
    @ApiProperty({ nullable: true }) albumId: string | null;
    @ApiProperty() artisteId: string;
    @ApiProperty() genreId: string;
    @ApiProperty() titre: string;
    @ApiProperty() duree: number;
    @ApiProperty() fichierAudioUrl: string;
    @ApiProperty({ nullable: true }) pochetteUrl: string | null;
    @ApiProperty({ nullable: true }) dateSortie: string | null;
    @ApiProperty() nombreEcoutes: number;
    @ApiProperty() dateAjout: Date;
    @ApiProperty({ enum: ['EN_ATTENTE', 'VALIDE', 'REJETE'] }) statutModeration: string;
}