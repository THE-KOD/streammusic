import { ApiProperty } from '@nestjs/swagger';
import { TrackResponseDto } from '../../../catalog-tracks/presentation/dto/track-response.dto';

export class NotificationResponseDto {
    @ApiProperty() id: string;
    @ApiProperty({ enum: ['NOUVELLE_SORTIE', 'SYSTEME'] }) type: string;
    @ApiProperty() message: string;
    @ApiProperty() dateEnvoi: Date;
    @ApiProperty() lu: boolean;
    @ApiProperty({ type: TrackResponseDto, nullable: true }) track: TrackResponseDto | null;
}