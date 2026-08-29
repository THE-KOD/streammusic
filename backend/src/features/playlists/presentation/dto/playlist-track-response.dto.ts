import { ApiProperty } from '@nestjs/swagger';
import { TrackResponseDto } from '../../../catalog-tracks/presentation/dto/track-response.dto';

// Réutilise TrackResponseDto en entier (fileUrl, artisteNom, albumTitre...)
// plutôt qu'un DTO à moitié rempli — même pattern que SuggestionResponseDto.
export class PlaylistTrackResponseDto extends TrackResponseDto {
    @ApiProperty() ordre: number;
}