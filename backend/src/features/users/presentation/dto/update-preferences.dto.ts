import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { IsUuidString } from '../../../../core/validators/is-uuid-string.decorator';

export class UpdatePreferencesDto {
    @ApiProperty({ type: [String] })
    @IsArray()
    @IsUuidString({ each: true })
    genreIds: string[];
}