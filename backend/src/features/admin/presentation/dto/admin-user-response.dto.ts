import { ApiProperty } from '@nestjs/swagger';

export class AdminUserResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() pseudo: string;
    @ApiProperty() email: string;
    @ApiProperty({ enum: ['ACTIF', 'SUSPENDU'] }) statutCompte: string;
    @ApiProperty() dateInscription: Date;
}