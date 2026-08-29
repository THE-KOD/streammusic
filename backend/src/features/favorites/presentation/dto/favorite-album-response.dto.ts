import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FavoriteAlbumResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() titre: string;
    @ApiProperty() artisteId: string;
    @ApiPropertyOptional() artisteNom?: string;
    @ApiProperty({ nullable: true }) pochetteUrl: string | null;
    @ApiProperty() dateSortie: string;
}