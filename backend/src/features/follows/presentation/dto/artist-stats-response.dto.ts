import { ApiProperty } from '@nestjs/swagger';

export class ArtistStatsResponseDto {
    @ApiProperty() followersCount: number;
    @ApiProperty() tracksCount: number;
}