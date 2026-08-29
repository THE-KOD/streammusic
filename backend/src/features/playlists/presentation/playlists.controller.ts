import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlaylistsService, PlaylistWithCount } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { ReorderTrackDto } from './dto/reorder-track.dto';
import { PlaylistResponseDto } from './dto/playlist-response.dto';
import { PlaylistTrackResponseDto } from './dto/playlist-track-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';
import { TrackEnrichmentService } from '../../catalog-tracks/presentation/track-enrichment.service';

function toResponseDto({ playlist, trackCount }: PlaylistWithCount): PlaylistResponseDto {
    return { id: playlist.id, proprietaireId: playlist.proprietaireId, nom: playlist.nom, visibilite: playlist.visibilite, dateCreation: playlist.dateCreation, trackCount };
}

@ApiTags('playlists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('playlists')
export class PlaylistsController {
    constructor(
        private readonly playlistsService: PlaylistsService,
        private readonly trackEnrichmentService: TrackEnrichmentService,
    ) {}

    @Get('mine')
    @ApiOperation({ summary: 'Lister mes propres playlists' })
    @ApiResponse({ status: 200, type: [PlaylistResponseDto] })
    async listMine(@CurrentUser() userId: string): Promise<PlaylistResponseDto[]> {
        return (await this.playlistsService.listMine(userId)).map(toResponseDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Consulter une playlist (la sienne, ou une publique)' })
    @ApiResponse({ status: 200, type: PlaylistResponseDto })
    @ApiResponse({ status: 404, description: 'Introuvable ou privée et non accessible' })
    async getById(@Param('id') id: string, @CurrentUser() userId: string): Promise<PlaylistResponseDto> {
        return toResponseDto(await this.playlistsService.getById(id, userId));
    }

    @Post()
    @ApiOperation({ summary: 'Créer une playlist' })
    @ApiResponse({ status: 201, type: PlaylistResponseDto })
    async create(@CurrentUser() userId: string, @Body() dto: CreatePlaylistDto): Promise<PlaylistResponseDto> {
        return toResponseDto(await this.playlistsService.create(userId, dto.nom, dto.visibilite));
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Renommer et/ou changer la visibilité (propriétaire uniquement)' })
    @ApiResponse({ status: 200, type: PlaylistResponseDto })
    async update(@Param('id') id: string, @CurrentUser() userId: string, @Body() dto: UpdatePlaylistDto): Promise<PlaylistResponseDto> {
        return toResponseDto(await this.playlistsService.update(id, userId, dto.nom, dto.visibilite));
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Supprimer une playlist (propriétaire uniquement)' })
    @ApiResponse({ status: 204 })
    async remove(@Param('id') id: string, @CurrentUser() userId: string): Promise<void> {
        await this.playlistsService.remove(id, userId);
    }

    @Get(':id/tracks')
    @ApiOperation({ summary: 'Lister les titres de la playlist, dans leur ordre' })
    @ApiResponse({ status: 200, type: [PlaylistTrackResponseDto] })
    async listTracks(@Param('id') id: string, @CurrentUser() userId: string): Promise<PlaylistTrackResponseDto[]> {
        const entries = await this.playlistsService.listTracks(id, userId);
        const dtos = await this.trackEnrichmentService.enrichMany(entries.map((e) => e.track));
        return dtos.map((dto, i) => ({ ...dto, ordre: entries[i].ordre }));
    }

    @Post(':id/tracks/:trackId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Ajouter un titre à la fin de la playlist' })
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: 409, description: 'Titre déjà présent' })
    async addTrack(@Param('id') id: string, @Param('trackId') trackId: string, @CurrentUser() userId: string): Promise<void> {
        await this.playlistsService.addTrack(id, userId, trackId);
    }

    @Delete(':id/tracks/:trackId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Retirer un titre de la playlist' })
    @ApiResponse({ status: 204 })
    async removeTrack(@Param('id') id: string, @Param('trackId') trackId: string, @CurrentUser() userId: string): Promise<void> {
        await this.playlistsService.removeTrack(id, userId, trackId);
    }

    @Patch(':id/tracks/:trackId/position')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Déplacer un titre à une nouvelle position' })
    @ApiResponse({ status: 204 })
    async reorderTrack(@Param('id') id: string, @Param('trackId') trackId: string, @CurrentUser() userId: string, @Body() dto: ReorderTrackDto): Promise<void> {
        await this.playlistsService.reorderTrack(id, userId, trackId, dto.versPosition);
    }
}