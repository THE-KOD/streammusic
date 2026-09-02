import { Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminStatsResponseDto } from './dto/admin-stats-response.dto';
import { AdminUserResponseDto } from './dto/admin-user-response.dto';
import { AdminModerationTrackResponseDto } from './dto/admin-moderation-track-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { Utilisateur } from '../../users';
import { ADMINISTRATEUR_REPOSITORY } from '../domain/administrateur.repository';
import type { AdministrateurRepository } from '../domain/administrateur.repository';
import { ARTISTE_REPOSITORY } from '../../catalog-artists';
import type { ArtisteRepository } from '../../catalog-artists';
import { ABONNEMENT_REPOSITORY } from '../../subscriptions';
import type { AbonnementRepository } from '../../subscriptions';
import { GENRE_REPOSITORY } from '../../catalog-genres';
import type { GenreRepository } from '../../catalog-genres';
import { TrackEnrichmentService } from '../../catalog-tracks/presentation/track-enrichment.service';

// Un controller "agrégateur" par nature : il combine volontairement
// plusieurs repositories d'autres features pour composer une vue admin —
// plus lourd que la moyenne des controllers, mais cohérent avec son rôle.
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly trackEnrichmentService: TrackEnrichmentService,
        @Inject(GENRE_REPOSITORY) private readonly genreRepository: GenreRepository,
        @Inject(ADMINISTRATEUR_REPOSITORY) private readonly administrateurRepository: AdministrateurRepository,
        @Inject(ARTISTE_REPOSITORY) private readonly artisteRepository: ArtisteRepository,
        @Inject(ABONNEMENT_REPOSITORY) private readonly abonnementRepository: AbonnementRepository,
    ) {}

    private async toEnrichedUserDto(u: Utilisateur): Promise<AdminUserResponseDto> {
        const [isAdmin, isArtist, abonnement] = await Promise.all([
            this.administrateurRepository.existsById(u.id),
            this.artisteRepository.existsById(u.id),
            this.abonnementRepository.findByUtilisateurId(u.id),
        ]);
        const role = isAdmin ? 'admin' : isArtist ? 'artist' : 'user';
        return {
            id: u.id, pseudo: u.pseudo, email: u.email, avatarUrl: u.photoProfilUrl ?? undefined,
            statutCompte: u.statutCompte, dateInscription: u.dateInscription,
            role, subscriptionTier: abonnement?.estPremium ? 'PREMIUM' : 'GRATUIT',
        };
    }

    @Get('stats')
    @ApiOperation({ summary: 'Statistiques globales' })
    @ApiResponse({ status: 200, type: AdminStatsResponseDto })
    getStats(): Promise<AdminStatsResponseDto> {
        return this.adminService.getStats();
    }

    @Get('users')
    @ApiOperation({ summary: 'Lister tous les comptes utilisateurs (rôle, abonnement inclus)' })
    @ApiResponse({ status: 200, type: [AdminUserResponseDto] })
    async listUsers(): Promise<AdminUserResponseDto[]> {
        const users = await this.adminService.listUsers();
        return Promise.all(users.map((u) => this.toEnrichedUserDto(u)));
    }

    @Patch('users/:id/suspend')
    @ApiOperation({ summary: 'Suspendre un compte' })
    @ApiResponse({ status: 200, type: AdminUserResponseDto })
    async suspendUser(@Param('id') id: string): Promise<AdminUserResponseDto> {
        return this.toEnrichedUserDto(await this.adminService.suspendUser(id));
    }

    @Patch('users/:id/reactivate')
    @ApiOperation({ summary: 'Réactiver un compte suspendu' })
    @ApiResponse({ status: 200, type: AdminUserResponseDto })
    async reactivateUser(@Param('id') id: string): Promise<AdminUserResponseDto> {
        return this.toEnrichedUserDto(await this.adminService.reactivateUser(id));
    }

    @Delete('users/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Supprimer définitivement un compte' })
    @ApiResponse({ status: 204 })
    async deleteUser(@Param('id') id: string): Promise<void> {
        await this.adminService.deleteUser(id);
    }

    @Get('tracks')
    @ApiQuery({ name: 'statut', required: false, enum: ['EN_ATTENTE', 'VALIDE', 'REJETE'] })
    @ApiOperation({ summary: 'Lister les titres pour modération, tous artistes confondus' })
    @ApiResponse({ status: 200, type: [AdminModerationTrackResponseDto] })
    async listTracksForModeration(@Query('statut') statut?: string): Promise<AdminModerationTrackResponseDto[]> {
        const tracks = await this.adminService.listTracksForModeration(statut);
        const enriched = await this.trackEnrichmentService.enrichMany(tracks);

        const genreIds = [...new Set(tracks.map((t) => t.genreId))];
        const genres = await Promise.all(genreIds.map((id) => this.genreRepository.findById(id)));
        const genreNomById = new Map(genres.filter((g) => g !== null).map((g) => [g!.id, g!.nom]));

        return enriched.map((dto, i) => ({ ...dto, genreNom: genreNomById.get(tracks[i].genreId) ?? '' }));
    }
}