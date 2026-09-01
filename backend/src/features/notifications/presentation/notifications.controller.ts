import { Controller, Get, HttpCode, HttpStatus, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { UnreadCountResponseDto } from './dto/unread-count-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';
import { Notification } from '../domain/notification.entity';
import { TRACK_REPOSITORY } from '../../catalog-tracks';
import type { TrackRepository } from '../../catalog-tracks';
import { TrackEnrichmentService } from '../../catalog-tracks/presentation/track-enrichment.service';
import { Inject } from '@nestjs/common';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(
        private readonly notificationsService: NotificationsService,
        @Inject(TRACK_REPOSITORY) private readonly trackRepository: TrackRepository,
        private readonly trackEnrichmentService: TrackEnrichmentService,
    ) {}

    private async toDtos(notifications: Notification[]): Promise<NotificationResponseDto[]> {
        // Certaines notifications (type SYSTEME) n'ont pas de titre associé —
        // on ne résout que celles qui en ont un, plutôt qu'un appel par notification.
        const withTrack = notifications.filter((n) => n.titreId !== null);
        const tracks = (await Promise.all(withTrack.map((n) => this.trackRepository.findById(n.titreId!)))).filter((t): t is NonNullable<typeof t> => t !== null);
        const enriched = await this.trackEnrichmentService.enrichMany(tracks);
        const dtoByTrackId = new Map(enriched.map((dto) => [dto.id, dto]));

        return notifications.map((n) => ({
            id: n.id, type: n.type, message: n.message, dateEnvoi: n.dateEnvoi, lu: n.lu,
            track: n.titreId ? (dtoByTrackId.get(n.titreId) ?? null) : null,
        }));
    }

    @Get('mine')
    @ApiQuery({ name: 'unread', required: false, description: 'true pour ne lister que les non lues' })
    @ApiOperation({ summary: 'Lister mes notifications' })
    @ApiResponse({ status: 200, type: [NotificationResponseDto] })
    async listMine(@CurrentUser() userId: string, @Query('unread') unread?: string): Promise<NotificationResponseDto[]> {
        const entries = await this.notificationsService.listMine(userId, unread === 'true');
        return this.toDtos(entries);
    }

    @Get('mine/unread-count')
    @ApiOperation({ summary: 'Compter mes notifications non lues (pour un badge)' })
    @ApiResponse({ status: 200, type: UnreadCountResponseDto })
    async unreadCount(@CurrentUser() userId: string): Promise<UnreadCountResponseDto> {
        return { count: await this.notificationsService.countUnread(userId) };
    }

    @Patch(':id/read')
    @ApiOperation({ summary: 'Marquer une notification comme lue' })
    @ApiResponse({ status: 200, type: NotificationResponseDto })
    @ApiResponse({ status: 403, description: "Notification appartenant à un autre utilisateur" })
    async markAsRead(@Param('id') id: string, @CurrentUser() userId: string): Promise<NotificationResponseDto> {
        const n = await this.notificationsService.markAsRead(id, userId);
        const [dto] = await this.toDtos([n]);
        return dto;
    }

    @Patch('mine/read-all')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Marquer toutes mes notifications comme lues' })
    @ApiResponse({ status: 204 })
    async markAllAsRead(@CurrentUser() userId: string): Promise<void> {
        await this.notificationsService.markAllAsRead(userId);
    }
}