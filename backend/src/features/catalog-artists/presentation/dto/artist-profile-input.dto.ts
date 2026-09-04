import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class ArtistProfileInputDto {
    @ApiPropertyOptional({ example: "Artiste basé à Lomé, passionné d'afrobeat..." })
    @IsOptional()
    @IsString()
    biographie?: string;

    @ApiPropertyOptional({ example: 'http://localhost:3000/uploads/covers/a1.jpg' })
    @IsOptional()
    @IsUrl({ require_tld: false })
    @MaxLength(500)
    photoArtisteUrl?: string;
}