import { ApiProperty } from '@nestjs/swagger';
import { TrackResponseDto } from '../../../catalog-tracks/presentation/dto/track-response.dto';

export class AdminModerationTrackResponseDto extends TrackResponseDto {
    @ApiProperty() genreNom: string;
}