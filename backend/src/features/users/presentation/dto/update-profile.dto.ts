import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
    @ApiPropertyOptional({ example: 'nouveau_pseudo' })
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    pseudo?: string;

    @ApiPropertyOptional({ example: 'https://cdn.example.com/avatars/u1.jpg' })
    @IsOptional()
    @IsUrl()
    @MaxLength(500)
    photoProfilUrl?: string;
}