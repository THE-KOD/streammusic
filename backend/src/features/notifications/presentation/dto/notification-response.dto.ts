import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
    @ApiProperty() id: string;
    @ApiProperty({ nullable: true }) titreId: string | null;
    @ApiProperty({ enum: ['NOUVELLE_SORTIE', 'SYSTEME'] }) type: string;
    @ApiProperty() message: string;
    @ApiProperty() dateEnvoi: Date;
    @ApiProperty() lu: boolean;
}