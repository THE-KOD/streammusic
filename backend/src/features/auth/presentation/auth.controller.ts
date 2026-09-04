import { Body, Controller, HttpCode, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthResponseDto, RefreshResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';
import { Utilisateur } from '../../users';
import { ADMINISTRATEUR_REPOSITORY } from '../../admin/domain/administrateur.repository';
import type { AdministrateurRepository } from '../../admin/domain/administrateur.repository';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        @Inject(ADMINISTRATEUR_REPOSITORY) private readonly administrateurRepository: AdministrateurRepository,
    ) {}

    // Calcule isAdmin UNE SEULE FOIS ici, à la connexion — le frontend n'a
    // plus jamais besoin d'interroger une route protégée pour le deviner
    // (c'était la cause du 403 systématique en console).
    private async toResponseDto(tokens: { accessToken: string; refreshToken: string }, utilisateur: Utilisateur): Promise<AuthResponseDto> {
        const isAdmin = await this.administrateurRepository.existsById(utilisateur.id);
        return { ...tokens, utilisateur: { id: utilisateur.id, pseudo: utilisateur.pseudo, email: utilisateur.email, isAdmin } };
    }

    @Post('register')
    @ApiOperation({ summary: 'Créer un compte' })
    @ApiResponse({ status: 201, type: AuthResponseDto })
    @ApiResponse({ status: 409, description: 'Email ou pseudo déjà utilisé' })
    async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
        const { tokens, utilisateur } = await this.authService.register(dto.pseudo, dto.email, dto.motDePasse);
        return this.toResponseDto(tokens, utilisateur);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Se connecter' })
    @ApiResponse({ status: 200, type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Identifiants invalides' })
    async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
        const { tokens, utilisateur } = await this.authService.login(dto.email, dto.motDePasse);
        return this.toResponseDto(tokens, utilisateur);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Renouveler l'access token" })
    @ApiResponse({ status: 200, type: RefreshResponseDto })
    @ApiResponse({ status: 401, description: 'Refresh token invalide ou expiré' })
    async refresh(@Body() dto: RefreshDto): Promise<RefreshResponseDto> {
        return this.authService.refresh(dto.refreshToken);
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Se déconnecter (révoque toutes les sessions actives)' })
    async logout(@CurrentUser() userId: string): Promise<void> {
        await this.authService.logout(userId);
    }
}