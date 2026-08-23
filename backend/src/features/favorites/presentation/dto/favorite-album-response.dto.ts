import { ApiProperty } from '@nestjs/swagger';

export class FavoriteAlbumResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() titre: string;
    @ApiProperty() artisteId: string;
    @ApiProperty({ nullable: true }) pochetteUrl: string | null;
}