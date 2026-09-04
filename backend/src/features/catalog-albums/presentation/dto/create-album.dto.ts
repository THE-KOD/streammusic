import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateAlbumDto {
    @ApiProperty({ example: 'Neon Static' })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    titre: string;

    @ApiProperty({ example: '2026-03-14', description: 'Format YYYY-MM-DD' })
    @IsDateString({ strict: true }, { message: 'dateSortie doit être une date valide au format YYYY-MM-DD.' })
    dateSortie: string;

    @ApiProperty({ required: false, example: 'http://localhost:3000/uploads/covers/xyz.jpg' })
    @IsOptional()
    @IsUrl({ require_tld: false }) // accepte localhost — même correction que CreateTrackDto
    @MaxLength(500)
    pochetteUrl?: string;
}