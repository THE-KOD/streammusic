import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePlaylistDto {
    @ApiProperty({ example: 'Ma playlist du matin' })
    @IsString()
    @MinLength(1)
    @MaxLength(100) // aligné sur VARCHAR(100) du schéma
    nom: string;

    @ApiPropertyOptional({ enum: ['PUBLIQUE', 'PRIVEE'], default: 'PRIVEE' })
    @IsOptional()
    @IsIn(['PUBLIQUE', 'PRIVEE'])
    visibilite?: 'PUBLIQUE' | 'PRIVEE';
}