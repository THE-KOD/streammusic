import { ApiProperty } from '@nestjs/swagger';

// DTO propre à ce module plutôt que de réutiliser TrackResponseDto de
// catalog-tracks/presentation : importer un DTO d'une autre feature depuis
// sa couche presentation violerait le contrat (seul domain/ est partageable
// entre features). Petite duplication assumée, pas un oubli.
export class FavoriteTrackResponseDto {
    @ApiProperty() id: string;
    @ApiProperty() titre: string;
    @ApiProperty() artisteId: string;
    @ApiProperty() duree: number;
    @ApiProperty({ nullable: true }) pochetteUrl: string | null;
}