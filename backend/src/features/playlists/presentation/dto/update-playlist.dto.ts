import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePlaylistDto {
    @ApiPropertyOptional({ example: 'Nouveau nom' })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    nom?: string;

    @ApiPropertyOptional({ enum: ['PUBLIQUE', 'PRIVEE'] })
    @IsOptional()
    @IsIn(['PUBLIQUE', 'PRIVEE'])
    visibilite?: 'PUBLIQUE' | 'PRIVEE';
}