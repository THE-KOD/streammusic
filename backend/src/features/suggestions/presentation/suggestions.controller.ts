import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuggestionsService } from './suggestions.service';
import { SuggestionResponseDto } from './dto/suggestion-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';
import { Track } from '../../catalog-tracks';

function toDto(track: Track, score: number): SuggestionResponseDto {
    return { titreId: track.id, titre: track.titre, artisteId: track.artisteId, duree: track.duree, pochetteUrl: track.pochetteUrl, score };
}

@ApiTags('suggestions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('suggestions')
export class SuggestionsController {
    constructor(private readonly suggestionsService: SuggestionsService) {}

    @Get('mine')
    @ApiOperation({ summary: 'Consulter mes dernières suggestions générées' })
    @ApiResponse({ status: 200, type: [SuggestionResponseDto] })
    async listMine(@CurrentUser() userId: string): Promise<SuggestionResponseDto[]> {
        return (await this.suggestionsService.listMine(userId)).map(({ track, score }) => toDto(track, score));
    }

    @Post('mine/generate')
    @ApiOperation({ summary: 'Régénérer mes suggestions à partir de mon historique récent' })
    @ApiResponse({ status: 201, type: [SuggestionResponseDto] })
    async regenerate(@CurrentUser() userId: string): Promise<SuggestionResponseDto[]> {
        return (await this.suggestionsService.regenerate(userId)).map(({ track, score }) => toDto(track, score));
    }
}