import { ApiProperty } from '@nestjs/swagger';

export class FavoriteStatusResponseDto {
    @ApiProperty() isFavorite: boolean;
}