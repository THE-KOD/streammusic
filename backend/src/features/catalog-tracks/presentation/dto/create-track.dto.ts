import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
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

    // IsString plutôt que IsUrl : accepte aussi bien une vraie URL de stockage
    // (à terme) qu'une URL locale blob: (aujourd'hui) — voir la note sur le
    // stockage différé en tête de réponse.
    @ApiProperty({ example: 'https://storage.example.com/tracks/xyz.mp3' })
    @IsString()
    @MaxLength(500)
    fichierAudioUrl: string;

    @ApiPropertyOptional({ example: 'https://cdn.example.com/tracks/xyz.jpg' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    pochetteUrl?: string;

    @ApiPropertyOptional({ example: '2026-03-14' })
    @IsOptional()
    @IsDateString({ strict: true })
    dateSortie?: string;
}