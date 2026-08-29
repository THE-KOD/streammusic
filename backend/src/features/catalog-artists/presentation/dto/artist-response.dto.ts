import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ArtistResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() pseudo: string;
    @ApiPropertyOptional() photoProfilUrl?: string;
    @ApiProperty({ nullable: true }) biographie: string | null;
    @ApiProperty({ nullable: true }) photoArtisteUrl: string | null;
    @ApiPropertyOptional() followersCount?: number;
    @ApiPropertyOptional() tracksCount?: number;
}