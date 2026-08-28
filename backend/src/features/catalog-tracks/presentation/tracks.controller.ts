import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TracksService } from './tracks.service';
import { TrackEnrichmentService } from './track-enrichment.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ModerateTrackDto } from './dto/moderate-track.dto';
import { TrackResponseDto } from './dto/track-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';
import { AdminGuard } from '../../admin';

@ApiTags('catalog-tracks')
@Controller('tracks')
export class TracksController {
    constructor(
        private readonly tracksService: TracksService,
        private readonly trackEnrichmentService: TrackEnrichmentService,
    ) {}

    @Get('mine')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Lister mes propres titres, tous statuts confondus' })
    @ApiResponse({ status: 200, type: [TrackResponseDto] })
    async listMine(@CurrentUser() userId: string): Promise<TrackResponseDto[]> {
        const tracks = await this.tracksService.listMine(userId);
        return this.trackEnrichmentService.enrichMany(tracks);
    }

    @Get()
    @ApiOperation({ summary: 'Lister le catalogue public (titres validés uniquement)' })
    @ApiQuery({ name: 'artisteId', required: false })
    @ApiQuery({ name: 'albumId', required: false })
    @ApiQuery({ name: 'genreId', required: false })
    @ApiResponse({ status: 200, type: [TrackResponseDto] })
    async list(
        @Query('artisteId') artisteId?: string,
        @Query('albumId') albumId?: string,
        @Query('genreId') genreId?: string,
    ): Promise<TrackResponseDto[]> {
        const tracks = await this.tracksService.listPublic({ artisteId, albumId, genreId });
        return this.trackEnrichmentService.enrichMany(tracks);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Consulter un titre (quel que soit son statut)' })
    @ApiResponse({ status: 200, type: TrackResponseDto })
    @ApiResponse({ status: 404, description: 'Titre introuvable' })
    async getById(@Param('id') id: string): Promise<TrackResponseDto> {
        const track = await this.tracksService.getById(id);
        return this.trackEnrichmentService.enrichOne(track);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Uploader un titre (statut initial : EN_ATTENTE)' })
    @ApiResponse({ status: 201, type: TrackResponseDto })
    async create(@CurrentUser() userId: string, @Body() dto: CreateTrackDto): Promise<TrackResponseDto> {
        const track = await this.tracksService.create(userId, dto);
        return this.trackEnrichmentService.enrichOne(track);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Modifier les métadonnées de son propre titre' })
    @ApiResponse({ status: 200, type: TrackResponseDto })
    @ApiResponse({ status: 403, description: 'Titre appartenant à un autre artiste' })
    async update(@Param('id') id: string, @CurrentUser() userId: string, @Body() dto: UpdateTrackDto): Promise<TrackResponseDto> {
        const track = await this.tracksService.update(id, userId, dto);
        return this.trackEnrichmentService.enrichOne(track);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Supprimer son propre titre' })
    @ApiResponse({ status: 204 })
    async remove(@Param('id') id: string, @CurrentUser() userId: string): Promise<void> {
        await this.tracksService.remove(id, userId);
    }

    @Patch(':id/moderer')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Valider ou rejeter un titre (administrateurs uniquement)' })
    @ApiResponse({ status: 200, type: TrackResponseDto })
    @ApiResponse({ status: 403, description: 'Réservé aux administrateurs' })
    async moderer(@Param('id') id: string, @CurrentUser() userId: string, @Body() dto: ModerateTrackDto): Promise<TrackResponseDto> {
        const track = await this.tracksService.moderer(id, dto.statut, userId);
        return this.trackEnrichmentService.enrichOne(track);
    }
}