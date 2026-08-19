import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'jane_doe' })
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    pseudo: string;

    @ApiProperty({ example: 'jane@example.com' })
    @IsEmail()
    @MaxLength(255)
    email: string;

    @ApiProperty({ example: 'motDePasseSecurise123' })
    @IsString()
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
    @MaxLength(72) // limite native de bcrypt
    motDePasse: string;
}