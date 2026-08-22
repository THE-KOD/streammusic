import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() utilisateurId: string;
    @ApiProperty({ enum: ['GRATUIT', 'PREMIUM'] }) type: string;
    @ApiProperty() dateDebut: string;
    @ApiProperty({ nullable: true }) dateFin: string | null;
}