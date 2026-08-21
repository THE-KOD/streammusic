import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString, IsUrl, IsUUID, MaxLength, Min, MinLength } from 'class-validator';

export class CreateTrackDto {
    @ApiProperty({ example: 'Midnight Drive' })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    titre: string;

    @ApiProperty({ description: 'UUID du genre — doit déjà exister' })
    @IsUUID()
    genreId: string;

    @ApiPropertyOptional({ description: 'UUID de l\'album — omis pour un single' })
    @IsOptional()
    @IsUUID()
    albumId?: string;

    @ApiProperty({ example: 222, description: 'Durée en secondes' })
    @IsInt()
    @Min(1) // miroir de chk_duree du schéma — voir aussi la validation domaine
    duree: number;

    @ApiProperty({ example: 'https://storage.example.com/tracks/xyz.mp3' })
    @IsUrl()
    @MaxLength(500)
    fichierAudioUrl: string;

    @ApiPropertyOptional({ example: 'https://cdn.example.com/tracks/xyz.jpg' })
    @IsOptional()
    @IsUrl()
    @MaxLength(500)
    pochetteUrl?: string;

    @ApiPropertyOptional({ example: '2026-03-14' })
    @IsOptional()
    @IsDateString({ strict: true })
    dateSortie?: string;
}