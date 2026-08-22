import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';
import { Abonnement } from '../domain/abonnement.entity';

function toResponseDto(abonnement: Abonnement): SubscriptionResponseDto {
    return {
        id: abonnement.id,
        utilisateurId: abonnement.utilisateurId,
        type: abonnement.type,
        dateDebut: abonnement.dateDebut,
        dateFin: abonnement.dateFin,
    };
}

@ApiTags('subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // toutes les routes de ce controller exigent une connexion
@Controller('subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) {}

    @Get('me')
    @ApiOperation({ summary: 'Consulter son propre abonnement' })
    @ApiResponse({ status: 200, type: SubscriptionResponseDto })
    async getMine(@CurrentUser() userId: string): Promise<SubscriptionResponseDto> {
        return toResponseDto(await this.subscriptionsService.getMine(userId));
    }

    @Post('me/upgrade')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Passer en Premium (démo — pas de vrai paiement)' })
    @ApiResponse({ status: 200, type: SubscriptionResponseDto })
    async upgrade(@CurrentUser() userId: string): Promise<SubscriptionResponseDto> {
        return toResponseDto(await this.subscriptionsService.upgradeToPremium(userId));
    }

    @Post('me/downgrade')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Revenir au plan Gratuit' })
    @ApiResponse({ status: 200, type: SubscriptionResponseDto })
    async downgrade(@CurrentUser() userId: string): Promise<SubscriptionResponseDto> {
        return toResponseDto(await this.subscriptionsService.downgradeToFree(userId));
    }
}