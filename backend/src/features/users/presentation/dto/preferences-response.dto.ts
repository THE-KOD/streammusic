import { ApiProperty } from '@nestjs/swagger';

export class PreferencesResponseDto {
    @ApiProperty({ type: [String] }) genreIds: string[];
}