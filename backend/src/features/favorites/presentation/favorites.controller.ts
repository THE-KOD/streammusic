import { Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { FavoriteTrackResponseDto } from './dto/favorite-track-response.dto';
import { FavoriteAlbumResponseDto } from './dto/favorite-album-response.dto';
import { FavoriteStatusResponseDto } from './dto/favorite-status-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';
import { TrackEnrichmentService } from '../../catalog-tracks/presentation/track-enrichment.service';
import { UTILISATEUR_REPOSITORY } from '../../users';
import type { UtilisateurRepository } from '../../users';

@ApiTags('favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
    constructor(
        private readonly favoritesService: FavoritesService,
        private readonly trackEnrichmentService: TrackEnrichmentService,
        @Inject(UTILISATEUR_REPOSITORY) private readonly utilisateurRepository: UtilisateurRepository,
    ) {}

    @Get('tracks')
    @ApiOperation({ summary: 'Lister mes titres likés' })
    @ApiResponse({ status: 200, type: [FavoriteTrackResponseDto] })
    async listTracks(@CurrentUser() userId: string): Promise<FavoriteTrackResponseDto[]> {
        return this.trackEnrichmentService.enrichMany(await this.favoritesService.listTracks(userId));
    }

    @Get('tracks/:trackId/status')
    @ApiOperation({ summary: "Vérifier si un titre est dans mes favoris" })
    @ApiResponse({ status: 200, type: FavoriteStatusResponseDto })
    async getTrackStatus(@CurrentUser() userId: string, @Param('trackId') trackId: string): Promise<FavoriteStatusResponseDto> {
        return { isFavorite: await this.favoritesService.isTrackLiked(userId, trackId) };
    }

    @Post('tracks/:trackId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Ajouter un titre à mes favoris (idempotent)' })
    @ApiResponse({ status: 204 })
    async addTrack(@CurrentUser() userId: string, @Param('trackId') trackId: string): Promise<void> {
        await this.favoritesService.addTrack(userId, trackId);
    }

    @Delete('tracks/:trackId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Retirer un titre de mes favoris (idempotent)' })
    @ApiResponse({ status: 204 })
    async removeTrack(@CurrentUser() userId: string, @Param('trackId') trackId: string): Promise<void> {
        await this.favoritesService.removeTrack(userId, trackId);
    }

    @Get('albums')
    @ApiOperation({ summary: 'Lister mes albums sauvegardés' })
    @ApiResponse({ status: 200, type: [FavoriteAlbumResponseDto] })
    async listAlbums(@CurrentUser() userId: string): Promise<FavoriteAlbumResponseDto[]> {
        const albums = await this.favoritesService.listAlbums(userId);
        const artisteIds = [...new Set(albums.map((a) => a.artisteId))];
        const utilisateurs = await Promise.all(artisteIds.map((id) => this.utilisateurRepository.findById(id)));
        const pseudoParArtiste = new Map(utilisateurs.filter((u) => u !== null).map((u) => [u!.id, u!.pseudo]));
        return albums.map((a) => ({ id: a.id, titre: a.titre, artisteId: a.artisteId, artisteNom: pseudoParArtiste.get(a.artisteId), pochetteUrl: a.pochetteUrl, dateSortie: a.dateSortie }));
    }

    @Get('albums/:albumId/status')
    @ApiOperation({ summary: 'Vérifier si un album est sauvegardé' })
    @ApiResponse({ status: 200, type: FavoriteStatusResponseDto })
    async getAlbumStatus(@CurrentUser() userId: string, @Param('albumId') albumId: string): Promise<FavoriteStatusResponseDto> {
        return { isFavorite: await this.favoritesService.isAlbumSaved(userId, albumId) };
    }

    @Post('albums/:albumId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Sauvegarder un album (idempotent)' })
    @ApiResponse({ status: 204 })
    async addAlbum(@CurrentUser() userId: string, @Param('albumId') albumId: string): Promise<void> {
        await this.favoritesService.addAlbum(userId, albumId);
    }

    @Delete('albums/:albumId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Retirer un album sauvegardé (idempotent)' })
    @ApiResponse({ status: 204 })
    async removeAlbum(@CurrentUser() userId: string, @Param('albumId') albumId: string): Promise<void> {
        await this.favoritesService.removeAlbum(userId, albumId);
    }
}