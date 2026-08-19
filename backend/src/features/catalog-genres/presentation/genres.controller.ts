import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreResponseDto } from './dto/enre-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { Genre } from '../domain/genre.entity';

// Petite fonction de conversion, réutilisée par toutes les routes du controller —
// évite de répéter { id: genre.id, nom: genre.nom } partout.
function toResponseDto(genre: Genre): GenreResponseDto {
    return { id: genre.id, nom: genre.nom };
}

@ApiTags('catalog-genres')
@Controller('genres')
export class GenresController {
    constructor(private readonly genresService: GenresService) {}

    // --- Lecture : publique, pas de token requis (parcourir le catalogue
    // doit être possible avant même de se connecter) ---

    @Get()
    @ApiOperation({ summary: 'Lister tous les genres' })
    @ApiResponse({ status: 200, type: [GenreResponseDto] })
    async list(): Promise<GenreResponseDto[]> {
        const genres = await this.genresService.list();
        return genres.map(toResponseDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Consulter un genre' })
    @ApiResponse({ status: 200, type: GenreResponseDto })
    @ApiResponse({ status: 404, description: 'Genre introuvable' })
    async getById(@Param('id') id: string): Promise<GenreResponseDto> {
        return toResponseDto(await this.genresService.getById(id));
    }

    // --- Écriture : nécessite d'être connecté (voir note en tête de réponse
    // sur la restriction "admin uniquement" encore absente) ---

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Créer un genre' })
    @ApiResponse({ status: 201, type: GenreResponseDto })
    @ApiResponse({ status: 409, description: 'Nom déjà utilisé' })
    async create(@Body() dto: CreateGenreDto): Promise<GenreResponseDto> {
        return toResponseDto(await this.genresService.create(dto.nom));
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Renommer un genre' })
    @ApiResponse({ status: 200, type: GenreResponseDto })
    async update(@Param('id') id: string, @Body() dto: CreateGenreDto): Promise<GenreResponseDto> {
        return toResponseDto(await this.genresService.update(id, dto.nom));
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Supprimer un genre (refusé si utilisé par un titre)' })
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: 409, description: 'Genre encore utilisé par au moins un titre' })
    async remove(@Param('id') id: string): Promise<void> {
        await this.genresService.remove(id);
    }
}