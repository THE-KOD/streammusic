import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListeningHistoryService } from './listening-history.service';
import { CreateHistoryEntryDto } from './dto/create-history-entry.dto';
import { HistoryEntryResponseDto } from './dto/history-entry-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';
import { HistoriqueEcoute } from '../domain/historique-ecoute.entity';
import { Track } from '../../catalog-tracks';

function toDto(entry: HistoriqueEcoute, track: Track): HistoryEntryResponseDto {
    return {
        id: entry.id, titreId: track.id, titre: track.titre, artisteId: track.artisteId,
        pochetteUrl: track.pochetteUrl, dateEcoute: entry.dateEcoute, dureeEcoutee: entry.dureeEcoutee,
    };
}

@ApiTags('listening-history')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('listening-history')
export class ListeningHistoryController {
    constructor(private readonly service: ListeningHistoryService) {}

    @Post()
    @ApiOperation({ summary: 'Enregistrer une écoute (incrémente aussi le compteur du titre)' })
    @ApiResponse({ status: 201, type: HistoryEntryResponseDto })
    @ApiResponse({ status: 400, description: 'Durée écoutée supérieure à la durée du titre' })
    async logListen(@CurrentUser() userId: string, @Body() dto: CreateHistoryEntryDto): Promise<HistoryEntryResponseDto> {
        const entry = await this.service.logListen(userId, dto.titreId, dto.dureeEcoutee);
        // On sait que le titre existe (vérifié par le service) — on le re-cherche
        // uniquement pour composer le DTO de réponse avec titre/artisteId.
        const track = await this.service['trackRepository'].findById(dto.titreId);
        return toDto(entry, track!);
    }

    @Get('mine')
    @ApiQuery({ name: 'limit', required: false, description: 'Défaut : 50' })
    @ApiOperation({ summary: 'Lister mon historique, du plus récent au plus ancien' })
    @ApiResponse({ status: 200, type: [HistoryEntryResponseDto] })
    async listMine(@CurrentUser() userId: string, @Query('limit') limit?: string): Promise<HistoryEntryResponseDto[]> {
        const parsedLimit = limit ? parseInt(limit, 10) : undefined;
        const entries = await this.service.listMine(userId, parsedLimit);
        return entries.map(({ entry, track }) => toDto(entry, track));
    }

    @Delete('mine')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Effacer tout mon historique' })
    @ApiResponse({ status: 204 })
    async clearMine(@CurrentUser() userId: string): Promise<void> {
        await this.service.clearMine(userId);
    }
}