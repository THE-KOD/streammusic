import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class SearchQueryDto {
    @ApiProperty({ example: 'midnight' })
    @IsString()
    @MinLength(1)
    q: string;

    @ApiPropertyOptional({ description: 'Filtre les titres par genre' })
    @IsOptional()
    @IsUUID()
    genreId?: string;

    @ApiPropertyOptional({ description: 'Durée minimale des titres, en secondes' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    dureeMin?: number;

    @ApiPropertyOptional({ description: 'Durée maximale des titres, en secondes' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    dureeMax?: number;
}