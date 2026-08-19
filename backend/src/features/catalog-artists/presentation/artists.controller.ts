import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArtistsService, ArtisteAvecPseudo } from './artists.service';
import { ArtistProfileInputDto } from './dto/artist-profile-input.dto';
import { ArtistResponseDto } from './dto/artist-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';
import { ForbiddenError } from '../../../core/errors';

// Convertit le résultat combiné (artiste + pseudo) vers la forme exposée à l'API.
function toResponseDto({ artiste, pseudo }: ArtisteAvecPseudo): ArtistResponseDto {
    return { id: artiste.id, pseudo, biographie: artiste.biographie, photoArtisteUrl: artiste.photoArtisteUrl };
}

@ApiTags('catalog-artists')
@Controller('artists')
export class ArtistsController {
    constructor(private readonly artistsService: ArtistsService) {}

    // --- Lecture : publique (parcourir le catalogue d'artistes sans compte) ---

    @Get()
    @ApiOperation({ summary: 'Lister les artistes' })
    @ApiResponse({ status: 200, type: [ArtistResponseDto] })
    async list(): Promise<ArtistResponseDto[]> {
        return (await this.artistsService.list()).map(toResponseDto);
    }

    @Get(':id')
    @ApiOperation({ summary: "Consulter la fiche publique d'un artiste" })
    @ApiResponse({ status: 200, type: ArtistResponseDto })
    @ApiResponse({ status: 404, description: 'Artiste introuvable' })
    async getById(@Param('id') id: string): Promise<ArtistResponseDto> {
        return toResponseDto(await this.artistsService.getById(id));
    }

    // --- Écriture : connecté, et pour PATCH uniquement son propre profil ---

    @Post('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Devenir artiste avec le compte actuellement connecté' })
    @ApiResponse({ status: 201, type: ArtistResponseDto })
    @ApiResponse({ status: 409, description: 'Ce compte est déjà un profil artiste' })
    async devenirArtiste(@CurrentUser() userId: string, @Body() dto: ArtistProfileInputDto): Promise<ArtistResponseDto> {
        return toResponseDto(await this.artistsService.devenirArtiste(userId, dto.biographie, dto.photoArtisteUrl));
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Modifier son propre profil artiste' })
    @ApiResponse({ status: 200, type: ArtistResponseDto })
    @ApiResponse({ status: 403, description: "Impossible de modifier le profil d'un autre artiste" })
    async updateProfile(
        @Param('id') id: string,
        @CurrentUser() userId: string,
        @Body() dto: ArtistProfileInputDto,
    ): Promise<ArtistResponseDto> {
        // Règle "un artiste ne modifie que son propre profil" — la levée d'exception
        // "un admin peut tout modifier" viendra avec le module admin (RolesGuard, étape 9).
        if (id !== userId) {
            throw new ForbiddenError('Vous ne pouvez modifier que votre propre profil artiste.');
        }
        return toResponseDto(await this.artistsService.updateProfile(id, dto.biographie, dto.photoArtisteUrl));
    }
}