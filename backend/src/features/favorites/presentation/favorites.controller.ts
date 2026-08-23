import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { FavoriteTrackResponseDto } from './dto/favorite-track-response.dto';
import { FavoriteAlbumResponseDto } from './dto/favorite-album-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';
import { Track } from '../../catalog-tracks';
import { Album } from '../../catalog-albums';

function toTrackDto(track: Track): FavoriteTrackResponseDto {
    return { id: track.id, titre: track.titre, artisteId: track.artisteId, duree: track.duree, pochetteUrl: track.pochetteUrl };
}
function toAlbumDto(album: Album): FavoriteAlbumResponseDto {
    return { id: album.id, titre: album.titre, artisteId: album.artisteId, pochetteUrl: album.pochetteUrl };
}

@ApiTags('favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // toutes les routes exigent une connexion — pas de bibliothèque publique
@Controller('favorites')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) {}

    @Get('tracks')
    @ApiOperation({ summary: 'Lister mes titres likés' })
    @ApiResponse({ status: 200, type: [FavoriteTrackResponseDto] })
    async listTracks(@CurrentUser() userId: string): Promise<FavoriteTrackResponseDto[]> {
        return (await this.favoritesService.listTracks(userId)).map(toTrackDto);
    }

    @Post('tracks/:trackId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Ajouter un titre à mes favoris (idempotent)' })
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: 404, description: 'Titre introuvable' })
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
        return (await this.favoritesService.listAlbums(userId)).map(toAlbumDto);
    }

    @Post('albums/:albumId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Sauvegarder un album (idempotent)' })
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: 404, description: 'Album introuvable' })
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