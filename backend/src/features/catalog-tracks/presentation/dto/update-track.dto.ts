import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUrl, IsUUID, MaxLength, MinLength } from 'class-validator';

// Pas de "duree" ni "fichierAudioUrl" ici : changer le fichier audio d'un
// titre déjà publié reviendrait à le remplacer entièrement — hors scope,
// ce serait plutôt "supprimer puis re-uploader".
export class UpdateTrackDto {
    @ApiPropertyOptional({ example: 'Midnight Drive (Remix)' })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    titre?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    genreId?: string;

    @ApiPropertyOptional({ nullable: true, description: 'null pour retirer le titre de son album (devient un single)' })
    @IsOptional()
    @IsUUID()
    albumId?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsUrl()
    @MaxLength(500)
    pochetteUrl?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsDateString({ strict: true })
    dateSortie?: string | null;
}