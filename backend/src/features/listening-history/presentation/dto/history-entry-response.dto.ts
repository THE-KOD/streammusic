import { ApiProperty } from '@nestjs/swagger';
import { TrackResponseDto } from '../../../catalog-tracks/presentation/dto/track-response.dto';

export class HistoryEntryResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() dateEcoute: Date;
    @ApiProperty() dureeEcoutee: number;
    @ApiProperty({ type: TrackResponseDto }) track: TrackResponseDto;
}