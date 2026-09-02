import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminUserResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() pseudo: string;
    @ApiProperty() email: string;
    @ApiPropertyOptional() avatarUrl?: string;
    @ApiProperty({ enum: ['ACTIF', 'SUSPENDU'] }) statutCompte: string;
    @ApiProperty() dateInscription: Date;
    @ApiProperty({ enum: ['user', 'artist', 'admin'] }) role: string;
    @ApiProperty({ enum: ['GRATUIT', 'PREMIUM'] }) subscriptionTier: string;
}