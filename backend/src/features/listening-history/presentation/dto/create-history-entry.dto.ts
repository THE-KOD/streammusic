import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateHistoryEntryDto {
    @ApiProperty({ description: 'UUID du titre écouté' })
    @IsUUID()
    titreId: string;

    @ApiProperty({ example: 187, description: 'Durée effectivement écoutée, en secondes' })
    @IsInt()
    @Min(0)
    dureeEcoutee: number;
}