import { ApiProperty } from '@nestjs/swagger';

export class FollowedArtistResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() pseudo: string; // recomposé depuis users, jamais dupliqué en base — même logique que catalog-artists
}