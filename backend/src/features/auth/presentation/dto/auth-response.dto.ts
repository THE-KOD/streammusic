import { ApiProperty } from '@nestjs/swagger';

class UtilisateurPublicDto {
    @ApiProperty() id: string;
    @ApiProperty() pseudo: string;
    @ApiProperty() email: string;
}

export class AuthResponseDto {
    @ApiProperty() accessToken: string;
    @ApiProperty() refreshToken: string;
    @ApiProperty({ type: UtilisateurPublicDto }) utilisateur: UtilisateurPublicDto;
}

export class RefreshResponseDto {
    @ApiProperty() accessToken: string;
    @ApiProperty() refreshToken: string;
}