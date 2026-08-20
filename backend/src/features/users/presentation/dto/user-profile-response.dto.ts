import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() pseudo: string;
    @ApiProperty() email: string;
    @ApiProperty({ nullable: true }) photoProfilUrl: string | null;
    @ApiProperty({ enum: ['ACTIF', 'SUSPENDU'] }) statutCompte: string;
    @ApiProperty({ enum: ['password', 'oauth'] }) authMethod: 'password' | 'oauth';
    @ApiProperty() dateInscription: Date;
}