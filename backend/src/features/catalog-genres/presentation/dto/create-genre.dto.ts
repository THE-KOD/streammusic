import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateGenreDto {
    @ApiProperty({ example: 'Afrobeat' })
    @IsString()
    @MinLength(2)
    @MaxLength(50) // aligné sur VARCHAR(50) du schéma SQL — jamais accepter côté API
    nom: string;   // ce que la base rejetterait de toute façon
}