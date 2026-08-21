import { ApiProperty } from '@nestjs/swagger';

export class AlbumResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() artisteId: string;
    @ApiProperty() titre: string;
    @ApiProperty({ nullable: true }) pochetteUrl: string | null;
    @ApiProperty() dateSortie: string;
}