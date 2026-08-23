import { ApiProperty } from '@nestjs/swagger';

export class HistoryEntryResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() titreId: string;
    @ApiProperty() titre: string;
    @ApiProperty() artisteId: string;
    @ApiProperty({ nullable: true }) pochetteUrl: string | null;
    @ApiProperty() dateEcoute: Date;
    @ApiProperty() dureeEcoutee: number;
}