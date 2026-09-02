import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString, IsUrl, MaxLength, Min, MinLength } from 'class-validator';
import { IsUuidString } from '../../../../core/validators/is-uuid-string.decorator';

export class CreateTrackDto {
    @ApiProperty({ example: 'Midnight Drive' })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    titre: string;

    @ApiProperty({ description: 'UUID du genre — doit déjà exister' })
    @IsUuidString()
    genreId: string;

    @ApiPropertyOptional({ description: "UUID de l'album — omis pour un single" })
    @IsOptional()
    @IsUuidString()
    albumId?: string;

    @ApiProperty({ example: 222, description: 'Durée en secondes' })
    @IsInt()
    @Min(1)
    duree: number;

    @ApiProperty({ example: 'http://localhost:3000/uploads/tracks/xyz.mp3' })
    @IsUrl({ require_tld: false }) // require_tld: false — accepte localhost en développement
    @MaxLength(500)
    fichierAudioUrl: string;

    @ApiPropertyOptional({ example: 'http://localhost:3000/uploads/covers/xyz.jpg' })
    @IsOptional()
    @IsUrl({ require_tld: false })
    @MaxLength(500)
    pochetteUrl?: string;

    @ApiPropertyOptional({ example: '2026-03-14' })
    @IsOptional()
    @IsDateString({ strict: true })
    dateSortie?: string;
}