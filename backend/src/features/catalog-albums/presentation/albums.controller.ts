import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumResponseDto } from './dto/album-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';
import { Album } from '../domain/album.entity';

function toResponseDto(album: Album): AlbumResponseDto {
    return { id: album.id, artisteId: album.artisteId, titre: album.titre, pochetteUrl: album.pochetteUrl, dateSortie: album.dateSortie };
}

@ApiTags('catalog-albums')
@Controller('albums')
export class AlbumsController {
    constructor(private readonly albumsService: AlbumsService) {}

    @Get()
    @ApiOperation({ summary: 'Lister les albums, avec filtre optionnel par artiste' })
    @ApiQuery({ name: 'artisteId', required: false })
    @ApiResponse({ status: 200, type: [AlbumResponseDto] })
    async list(@Query('artisteId') artisteId?: string): Promise<AlbumResponseDto[]> {
        const albums = artisteId ? await this.albumsService.listByArtiste(artisteId) : await this.albumsService.list();
        return albums.map(toResponseDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Consulter un album' })
    @ApiResponse({ status: 200, type: AlbumResponseDto })
    @ApiResponse({ status: 404, description: 'Album introuvable' })
    async getById(@Param('id') id: string): Promise<AlbumResponseDto> {
        return toResponseDto(await this.albumsService.getById(id));
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Créer un album pour l'artiste connecté" })
    @ApiResponse({ status: 201, type: AlbumResponseDto })
    @ApiResponse({ status: 404, description: "Le compte connecté n'a pas de profil artiste" })
    async create(@CurrentUser() userId: string, @Body() dto: CreateAlbumDto): Promise<AlbumResponseDto> {
        // userId (id de l'utilisateur connecté) = id du profil artiste,
        // même mécanisme de relation 1-1 que dans catalog-artists.
        const album = await this.albumsService.create(userId, dto.titre, dto.dateSortie, dto.pochetteUrl);
        return toResponseDto(album);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Modifier un album (propriétaire uniquement)' })
    @ApiResponse({ status: 200, type: AlbumResponseDto })
    @ApiResponse({ status: 403, description: "Album appartenant à un autre artiste" })
    async update(@Param('id') id: string, @CurrentUser() userId: string, @Body() dto: UpdateAlbumDto): Promise<AlbumResponseDto> {
        return toResponseDto(await this.albumsService.update(id, userId, dto.titre, dto.pochetteUrl));
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Supprimer un album (propriétaire uniquement)' })
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: 403, description: "Album appartenant à un autre artiste" })
    async remove(@Param('id') id: string, @CurrentUser() userId: string): Promise<void> {
        await this.albumsService.remove(id, userId);
    }
}