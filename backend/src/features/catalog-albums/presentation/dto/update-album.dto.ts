import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

// dateSortie volontairement absent : on considère la date de sortie comme
// figée une fois l'album créé (cas d'usage réel rare de la changer,
// contrairement au titre ou à la pochette qu'on ajuste plus souvent).
export class UpdateAlbumDto {
    @ApiPropertyOptional({ example: 'Neon Static (Deluxe)' })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    titre?: string;

    @ApiPropertyOptional({ example: 'https://cdn.example.com/albums/v2.jpg' })
    @IsOptional()
    @IsUrl()
    @MaxLength(500)
    pochetteUrl?: string;
}