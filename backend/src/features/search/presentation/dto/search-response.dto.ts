import { ApiProperty } from '@nestjs/swagger';

export class SearchTrackResultDto {
    @ApiProperty() id: string;
    @ApiProperty() titre: string;
    @ApiProperty() artisteId: string;
    @ApiProperty() artisteNom: string;
    @ApiProperty() duree: number;
    @ApiProperty({ nullable: true }) pochetteUrl: string | null;
}

export class SearchArtistResultDto {
    @ApiProperty() id: string;
    @ApiProperty() pseudo: string;
}

export class SearchAlbumResultDto {
    @ApiProperty() id: string;
    @ApiProperty() titre: string;
    @ApiProperty() artisteId: string;
    @ApiProperty({ nullable: true }) pochetteUrl: string | null;
}

export class SearchResponseDto {
    @ApiProperty({ type: [SearchTrackResultDto] }) tracks: SearchTrackResultDto[];
    @ApiProperty({ type: [SearchArtistResultDto] }) artists: SearchArtistResultDto[];
    @ApiProperty({ type: [SearchAlbumResultDto] }) albums: SearchAlbumResultDto[];
}