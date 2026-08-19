import { ApiProperty } from '@nestjs/swagger';

export class ArtistResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() pseudo: string; // vient de `users`, jamais stocké côté artiste
    @ApiProperty({ nullable: true }) biographie: string | null;
    @ApiProperty({ nullable: true }) photoArtisteUrl: string | null;
}