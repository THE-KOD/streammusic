import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';
import { SearchResponseDto } from './dto/search-response.dto';

@ApiTags('search')
@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    // Public, volontairement — parcourir/rechercher dans le catalogue ne
    // nécessite pas de compte, même logique que les GET de catalog-tracks.
    @ApiOperation({ summary: 'Recherche combinée titres/artistes/albums' })
    @ApiResponse({ status: 200, type: SearchResponseDto })
    async search(@Query() dto: SearchQueryDto): Promise<SearchResponseDto> {
        const result = await this.searchService.search(dto.q, { genreId: dto.genreId, dureeMin: dto.dureeMin, dureeMax: dto.dureeMax });
        return {
            tracks: result.tracks.map((t) => ({ id: t.id, titre: t.titre, artisteId: t.artisteId, artisteNom: t.artisteNom, duree: t.duree, pochetteUrl: t.pochetteUrl })),
            artists: result.artists,
            albums: result.albums.map((a) => ({ id: a.id, titre: a.titre, artisteId: a.artisteId, pochetteUrl: a.pochetteUrl })),
        };
    }
}