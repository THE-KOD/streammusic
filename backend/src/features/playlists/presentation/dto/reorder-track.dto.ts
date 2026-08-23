import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class ReorderTrackDto {
    @ApiProperty({ example: 0, description: 'Nouvelle position, 0-based' })
    @IsInt()
    @Min(0)
    versPosition: number;
}