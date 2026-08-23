import { ApiProperty } from '@nestjs/swagger';

// DTO propre à ce module plutôt que de réutiliser celui de catalog-tracks —
// même règle déjà appliquée dans favorites : jamais d'import depuis la
// couche presentation d'une autre feature.
export class PlaylistTrackResponseDto {
    @ApiProperty() titreId: string;
    @ApiProperty() titre: string;
    @ApiProperty() artisteId: string;
    @ApiProperty() duree: number;
    @ApiProperty({ nullable: true }) pochetteUrl: string | null;
    @ApiProperty() ordre: number;
}