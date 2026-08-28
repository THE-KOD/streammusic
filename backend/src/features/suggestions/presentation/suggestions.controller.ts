import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuggestionsService } from './suggestions.service';
import { SuggestionResponseDto } from './dto/suggestion-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';
import { TrackEnrichmentService } from '../../catalog-tracks/presentation/track-enrichment.service';

@ApiTags('suggestions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('suggestions')
export class SuggestionsController {
    constructor(
        private readonly suggestionsService: SuggestionsService,
        private readonly trackEnrichmentService: TrackEnrichmentService,
    ) {}

    private async toDtos(entries: { track: any; score: number }[]): Promise<SuggestionResponseDto[]> {
        const dtos = await this.trackEnrichmentService.enrichMany(entries.map((e) => e.track));
        return dtos.map((dto, i) => ({ ...dto, score: entries[i].score }));
    }

    @Get('mine')
    @ApiOperation({ summary: 'Consulter mes dernières suggestions générées' })
    @ApiResponse({ status: 200, type: [SuggestionResponseDto] })
    async listMine(@CurrentUser() userId: string): Promise<SuggestionResponseDto[]> {
        return this.toDtos(await this.suggestionsService.listMine(userId));
    }

    @Post('mine/generate')
    @ApiOperation({ summary: 'Régénérer mes suggestions à partir de mon historique récent' })
    @ApiResponse({ status: 201, type: [SuggestionResponseDto] })
    async regenerate(@CurrentUser() userId: string): Promise<SuggestionResponseDto[]> {
        return this.toDtos(await this.suggestionsService.regenerate(userId));
    }
}