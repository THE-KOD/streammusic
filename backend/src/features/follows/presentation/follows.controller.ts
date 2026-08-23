import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FollowsService } from './follows.service';
import { FollowStatusResponseDto } from './dto/follow-status-response.dto';
import { FollowedArtistResponseDto } from './dto/followed-artist-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';

@ApiTags('follows')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('follows')
export class FollowsController {
    constructor(private readonly followsService: FollowsService) {}

    @Get()
    @ApiOperation({ summary: 'Lister les artistes que je suis' })
    @ApiResponse({ status: 200, type: [FollowedArtistResponseDto] })
    async listFollowed(@CurrentUser() userId: string): Promise<FollowedArtistResponseDto[]> {
        return this.followsService.listFollowed(userId);
    }

    @Get(':artistId/status')
    @ApiOperation({ summary: 'Vérifier si je suis un artiste donné' })
    @ApiResponse({ status: 200, type: FollowStatusResponseDto })
    async getStatus(@CurrentUser() userId: string, @Param('artistId') artistId: string): Promise<FollowStatusResponseDto> {
        return { isFollowing: await this.followsService.isFollowing(userId, artistId) };
    }

    @Post(':artistId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Suivre un artiste (idempotent)' })
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: 400, description: 'Impossible de se suivre soi-même' })
    @ApiResponse({ status: 404, description: 'Artiste introuvable' })
    async follow(@CurrentUser() userId: string, @Param('artistId') artistId: string): Promise<void> {
        await this.followsService.follow(userId, artistId);
    }

    @Delete(':artistId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Ne plus suivre un artiste (idempotent)' })
    @ApiResponse({ status: 204 })
    async unfollow(@CurrentUser() userId: string, @Param('artistId') artistId: string): Promise<void> {
        await this.followsService.unfollow(userId, artistId);
    }
}