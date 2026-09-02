import { ApiProperty } from '@nestjs/swagger';

export class TopTrackDto {
    @ApiProperty() id: string;
    @ApiProperty() titre: string;
    @ApiProperty() artisteId: string;
    @ApiProperty() artisteNom: string;
    @ApiProperty() nombreEcoutes: number;
}

export class AdminStatsResponseDto {
    @ApiProperty() totalUtilisateurs: number;
    @ApiProperty() totalTitres: number;
    @ApiProperty() totalEcoutes: number;
    @ApiProperty({ type: [TopTrackDto] }) titresPopulaires: TopTrackDto[];
}