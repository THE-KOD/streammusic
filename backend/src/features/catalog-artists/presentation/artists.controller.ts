import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArtistsService, ArtisteAvecPseudo } from './artists.service';
import { ArtistProfileInputDto } from './dto/artist-profile-input.dto';
import { ArtistResponseDto } from './dto/artist-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';
import { ForbiddenError } from '../../../core/errors';

function toBaseDto({ artiste, pseudo, photoProfilUrl }: ArtisteAvecPseudo): ArtistResponseDto {
    return { id: artiste.id, pseudo, photoProfilUrl: photoProfilUrl ?? undefined, biographie: artiste.biographie, photoArtisteUrl: artiste.photoArtisteUrl };
}

@ApiTags('catalog-artists')
@Controller('artists')
export class ArtistsController {
    constructor(private readonly artistsService: ArtistsService) {}

    @Get()
    @ApiOperation({ summary: 'Lister les artistes' })
    @ApiResponse({ status: 200, type: [ArtistResponseDto] })
    async list(): Promise<ArtistResponseDto[]> {
        return (await this.artistsService.list()).map(toBaseDto);
    }

    @Get(':id')
    @ApiOperation({ summary: "Consulter la fiche publique d'un artiste" })
    @ApiResponse({ status: 200, type: ArtistResponseDto })
    @ApiResponse({ status: 404, description: 'Artiste introuvable' })
    async getById(@Param('id') id: string): Promise<ArtistResponseDto> {
        return toBaseDto(await this.artistsService.getById(id));
    }

    @Post('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Devenir artiste avec le compte actuellement connecté' })
    @ApiResponse({ status: 201, type: ArtistResponseDto })
    @ApiResponse({ status: 409, description: 'Ce compte est déjà un profil artiste' })
    async devenirArtiste(@CurrentUser() userId: string, @Body() dto: ArtistProfileInputDto): Promise<ArtistResponseDto> {
        return toBaseDto(await this.artistsService.devenirArtiste(userId, dto.biographie, dto.photoArtisteUrl));
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Modifier son propre profil artiste' })
    @ApiResponse({ status: 200, type: ArtistResponseDto })
    @ApiResponse({ status: 403, description: "Impossible de modifier le profil d'un autre artiste" })
    async updateProfile(@Param('id') id: string, @CurrentUser() userId: string, @Body() dto: ArtistProfileInputDto): Promise<ArtistResponseDto> {
        if (id !== userId) throw new ForbiddenError('Vous ne pouvez modifier que votre propre profil artiste.');
        return toBaseDto(await this.artistsService.updateProfile(id, dto.biographie, dto.photoArtisteUrl));
    }
}