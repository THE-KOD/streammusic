import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../../core/decorators/current-user.decorator';
import { Utilisateur } from '../domain/user.entity';
import { PreferencesResponseDto } from './dto/preferences-response.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

function toResponseDto(utilisateur: Utilisateur): UserProfileResponseDto {
    return {
        id: utilisateur.id,
        pseudo: utilisateur.pseudo,
        email: utilisateur.email,
        photoProfilUrl: utilisateur.photoProfilUrl,
        statutCompte: utilisateur.statutCompte,
        authMethod: utilisateur.estConnecteViaOAuth ? 'oauth' : 'password',
        dateInscription: utilisateur.dateInscription,
    };
}

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    @ApiOperation({ summary: 'Consulter son propre profil' })
    @ApiResponse({ status: 200, type: UserProfileResponseDto })
    async getMe(@CurrentUser() userId: string): Promise<UserProfileResponseDto> {
        const utilisateur = await this.usersService.getProfile(userId);
        return toResponseDto(utilisateur);
    }

    @Patch('me')
    @ApiOperation({ summary: 'Modifier son propre profil (pseudo, photo)' })
    @ApiResponse({ status: 200, type: UserProfileResponseDto })
    @ApiResponse({ status: 409, description: 'Pseudo déjà utilisé' })
    async updateMe(@CurrentUser() userId: string, @Body() dto: UpdateProfileDto): Promise<UserProfileResponseDto> {
        const utilisateur = await this.usersService.updateProfile(userId, dto);
        return toResponseDto(utilisateur);
    }

    @Get('me/preferences')
    @ApiOperation({ summary: 'Consulter mes genres préférés' })
    @ApiResponse({ status: 200, type: PreferencesResponseDto })
    async getMyPreferences(@CurrentUser() userId: string): Promise<PreferencesResponseDto> {
        return { genreIds: await this.usersService.getGenrePreferences(userId) };
    }

    @Patch('me/preferences')
    @ApiOperation({ summary: 'Remplacer mes genres préférés' })
    @ApiResponse({ status: 200, type: PreferencesResponseDto })
    @ApiResponse({ status: 404, description: 'Un des genres fournis est introuvable' })
    async updateMyPreferences(@CurrentUser() userId: string, @Body() dto: UpdatePreferencesDto): Promise<PreferencesResponseDto> {
        const genreIds = await this.usersService.updateGenrePreferences(userId, dto.genreIds);
        return { genreIds };
    }
}