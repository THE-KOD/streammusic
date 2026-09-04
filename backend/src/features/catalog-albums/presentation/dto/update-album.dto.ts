import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateAlbumDto {
    @ApiPropertyOptional({ example: 'Neon Static (Deluxe)' })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    titre?: string;

    @ApiPropertyOptional({ example: 'http://localhost:3000/uploads/covers/v2.jpg' })
    @IsOptional()
    @IsUrl({ require_tld: false })
    @MaxLength(500)
    pochetteUrl?: string;
}