import { ApiProperty } from '@nestjs/swagger';

export class GenreResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() nom: string;
}