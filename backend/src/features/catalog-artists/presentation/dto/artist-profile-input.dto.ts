import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

// Même forme utilisée pour "devenir artiste" (POST) et "modifier son profil" (PATCH) —
// dans les deux cas, on fournit optionnellement une bio et/ou une photo.
export class ArtistProfileInputDto {
    @ApiPropertyOptional({ example: 'Artiste basé à Lomé, passionné d\'afrobeat...' })
    @IsOptional()
    @IsString()
    biographie?: string;

    @ApiPropertyOptional({ example: 'https://cdn.example.com/artists/a1.jpg' })
    @IsOptional()
    @IsUrl()
    @MaxLength(500) // aligné sur VARCHAR(500) du schéma SQL
    photoArtisteUrl?: string;
}