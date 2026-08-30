import { Body, Controller, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthResponseDto, RefreshResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Créer un compte' })
    @ApiResponse({ status: 201, type: AuthResponseDto })
    @ApiResponse({ status: 409, description: 'Email ou pseudo déjà utilisé' })
    async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
        const { tokens, utilisateur } = await this.authService.register(dto.pseudo, dto.email, dto.motDePasse);
        return { ...tokens, utilisateur: { id: utilisateur.id, pseudo: utilisateur.pseudo, email: utilisateur.email } };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Se connecter' })
    @ApiResponse({ status: 200, type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Identifiants invalides' })
    async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
        const { tokens, utilisateur } = await this.authService.login(dto.email, dto.motDePasse);
        return { ...tokens, utilisateur: { id: utilisateur.id, pseudo: utilisateur.pseudo, email: utilisateur.email } };
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

    @Patch('password')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Changer son mot de passe' })
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: 401, description: 'Mot de passe actuel incorrect' })
    @ApiResponse({ status: 403, description: 'Compte OAuth sans mot de passe' })
    async changePassword(@CurrentUser() userId: string, @Body() dto: ChangePasswordDto): Promise<void> {
        await this.authService.changePassword(userId, dto.currentPassword, dto.newPassword);
    }
}