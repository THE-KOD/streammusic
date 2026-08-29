import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FollowedArtistResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() pseudo: string;
    @ApiPropertyOptional() photoProfilUrl?: string;
}