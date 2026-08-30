import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class UpdatePreferencesDto {
    @ApiProperty({ type: [String] })
    @IsArray()
    @IsUUID('4', { each: true })
    genreIds: string[];
}