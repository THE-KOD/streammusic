import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { IsUuidString } from '../../../../core/validators/is-uuid-string.decorator';

export class UpdateTrackDto {
    @ApiPropertyOptional({ example: 'Midnight Drive (Remix)' })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    titre?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUuidString()
    genreId?: string;

    @ApiPropertyOptional({ nullable: true, description: 'null pour retirer le titre de son album (devient un single)' })
    @IsOptional()
    @IsUuidString()
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