import { ApiProperty } from '@nestjs/swagger';
import { TrackResponseDto } from '../../../catalog-tracks/presentation/dto/track-response.dto';

export class SuggestionResponseDto extends TrackResponseDto {
    @ApiProperty() score: number;
}