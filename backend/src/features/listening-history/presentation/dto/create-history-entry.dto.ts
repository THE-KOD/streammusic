import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { IsUuidString } from '../../../../core/validators/is-uuid-string.decorator';

export class CreateHistoryEntryDto {
    @ApiProperty({ description: 'UUID du titre écouté' })
    @IsUuidString()
    titreId: string;

    @ApiProperty({ example: 187, description: 'Durée effectivement écoutée, en secondes' })
    @IsInt()
    @Min(0)
    dureeEcoutee: number;
}