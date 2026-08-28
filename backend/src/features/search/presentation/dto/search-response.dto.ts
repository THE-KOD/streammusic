import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchTrackResultDto {
    @ApiProperty() id: string;
    @ApiProperty() titre: string;
    @ApiProperty() artisteId: string;
    @ApiProperty() artisteNom: string;
    @ApiPropertyOptional({ nullable: true }) albumId?: string | null;
    @ApiPropertyOptional({ nullable: true }) albumTitre?: string | null;
    @ApiProperty() duree: number;
    @ApiProperty({ nullable: true }) pochetteUrl: string | null;
    @ApiProperty() fichierAudioUrl: string;
}

export class SearchArtistResultDto {
    @ApiProperty() id: string;
    @ApiProperty() pseudo: string;
    @ApiProperty({ nullable: true }) photoArtisteUrl: string | null;
}

export class SearchAlbumResultDto {
    @ApiProperty() id: string;
    @ApiProperty() titre: string;
    @ApiProperty() artisteId: string;
    @ApiProperty() artisteNom: string;
    @ApiProperty({ nullable: true }) pochetteUrl: string | null;
    @ApiProperty() dateSortie: string;
}

export class SearchResponseDto {
    @ApiProperty({ type: [SearchTrackResultDto] }) tracks: SearchTrackResultDto[];
    @ApiProperty({ type: [SearchArtistResultDto] }) artists: SearchArtistResultDto[];
    @ApiProperty({ type: [SearchAlbumResultDto] }) albums: SearchAlbumResultDto[];
}