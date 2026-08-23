import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueueService } from './queue.service';
import { ReorderQueueTrackDto } from './dto/reorder-queue-track.dto';
import { QueueTrackResponseDto } from './dto/queue-track-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';
import { Track } from '../../catalog-tracks';

function toDto(track: Track, ordre: number): QueueTrackResponseDto {
    return { titreId: track.id, titre: track.titre, artisteId: track.artisteId, duree: track.duree, pochetteUrl: track.pochetteUrl, ordre };
}

@ApiTags('queue')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('queue')
export class QueueController {
    constructor(private readonly queueService: QueueService) {}

    @Get()
    @ApiOperation({ summary: "Consulter ma file d'attente, dans l'ordre" })
    @ApiResponse({ status: 200, type: [QueueTrackResponseDto] })
    async list(@CurrentUser() userId: string): Promise<QueueTrackResponseDto[]> {
        const entries = await this.queueService.list(userId);
        return entries.map(({ track, ordre }) => toDto(track, ordre));
    }

    @Post(':trackId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Ajouter un titre à la fin de la file (la crée si c'est le premier ajout)" })
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: 409, description: 'Titre déjà présent dans la file' })
    async addTrack(@CurrentUser() userId: string, @Param('trackId') trackId: string): Promise<void> {
        await this.queueService.addTrack(userId, trackId);
    }

    @Delete(':trackId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Retirer un titre de la file' })
    @ApiResponse({ status: 204 })
    async removeTrack(@CurrentUser() userId: string, @Param('trackId') trackId: string): Promise<void> {
        await this.queueService.removeTrack(userId, trackId);
    }

    @Patch(':trackId/position')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Déplacer un titre à une nouvelle position' })
    @ApiResponse({ status: 204 })
    async reorderTrack(
        @CurrentUser() userId: string,
        @Param('trackId') trackId: string,
        @Body() dto: ReorderQueueTrackDto,
    ): Promise<void> {
        await this.queueService.reorderTrack(userId, trackId, dto.versPosition);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Vider entièrement la file d'attente" })
    @ApiResponse({ status: 204 })
    async clear(@CurrentUser() userId: string): Promise<void> {
        await this.queueService.clear(userId);
    }
}