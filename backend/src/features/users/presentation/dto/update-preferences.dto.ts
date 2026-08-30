import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, Matches } from 'class-validator';

// Regex vérifiée directement plutôt que de dépendre du comportement
// version-dépendant de @IsUUID() — accepte tout UUID valide dans sa forme
// (8-4-4-4-12 hexadécimal), quelle que soit sa version.
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class UpdatePreferencesDto {
    @ApiProperty({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    @Matches(UUID_PATTERN, { each: true, message: 'each value in genreIds must be a valid UUID' })
    genreIds: string[];
}