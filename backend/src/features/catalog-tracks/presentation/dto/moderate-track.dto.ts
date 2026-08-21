import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class ModerateTrackDto {
    @ApiProperty({ enum: ['VALIDE', 'REJETE'] })
    @IsIn(['VALIDE', 'REJETE'], { message: 'statut doit être VALIDE ou REJETE.' })
    statut: 'VALIDE' | 'REJETE';
}