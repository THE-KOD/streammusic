import { ApiProperty } from '@nestjs/swagger';

export class QueueTrackResponseDto {
    @ApiProperty() titreId: string;
    @ApiProperty() titre: string;
    @ApiProperty() artisteId: string;
    @ApiProperty() duree: number;
    @ApiProperty({ nullable: true }) pochetteUrl: string | null;
    @ApiProperty() ordre: number;
}