import { ApiProperty } from '@nestjs/swagger';

export class PlaylistResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() proprietaireId: string;
    @ApiProperty() nom: string;
    @ApiProperty({ enum: ['PUBLIQUE', 'PRIVEE'] }) visibilite: string;
    @ApiProperty() dateCreation: Date;
    @ApiProperty() trackCount: number;
}