import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchTrackResultDto {
    @ApiProperty() id: string;
    @ApiProperty() titre: string;
    @ApiProperty() artisteId: string;
    @ApiProperty() artisteNom: string;
    @ApiProperty() duree: number;
    @ApiProperty() fichierAudioUrl: string;
    @ApiProperty({ nullable: true }) pochetteUrl: string | null;
}

export class SearchArtistResultDto {
    @ApiProperty() id: string;
    @ApiProperty() pseudo: string;
    @ApiPropertyOptional() photoProfilUrl?: string;
}

export class SearchAlbumResultDto {
    @ApiProperty() id: string;
    @ApiProperty() titre: string;
    @ApiProperty() artisteId: string;
    @ApiPropertyOptional() artisteNom?: string;
    @ApiProperty({ nullable: true }) pochetteUrl: string | null;
    @ApiProperty() dateSortie: string;
}

export class SearchResponseDto {
    @ApiProperty({ type: [SearchTrackResultDto] }) tracks: SearchTrackResultDto[];
    @ApiProperty({ type: [SearchArtistResultDto] }) artists: SearchArtistResultDto[];
    @ApiProperty({ type: [SearchAlbumResultDto] }) albums: SearchAlbumResultDto[];
}