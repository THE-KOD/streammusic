import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminStatsResponseDto } from './dto/admin-stats-response.dto';
import { AdminUserResponseDto } from './dto/admin-user-response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { Utilisateur } from '../../users';

function toUserDto(u: Utilisateur): AdminUserResponseDto {
    return { id: u.id, pseudo: u.pseudo, email: u.email, statutCompte: u.statutCompte, dateInscription: u.dateInscription };
}

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard) // s'applique à TOUTES les routes de ce controller
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('stats')
    @ApiOperation({ summary: 'Statistiques globales' })
    @ApiResponse({ status: 200, type: AdminStatsResponseDto })
    getStats(): Promise<AdminStatsResponseDto> {
        return this.adminService.getStats();
    }

    @Get('users')
    @ApiOperation({ summary: 'Lister tous les comptes utilisateurs' })
    @ApiResponse({ status: 200, type: [AdminUserResponseDto] })
    async listUsers(): Promise<AdminUserResponseDto[]> {
        return (await this.adminService.listUsers()).map(toUserDto);
    }

    @Patch('users/:id/suspend')
    @ApiOperation({ summary: 'Suspendre un compte' })
    @ApiResponse({ status: 200, type: AdminUserResponseDto })
    async suspendUser(@Param('id') id: string): Promise<AdminUserResponseDto> {
        return toUserDto(await this.adminService.suspendUser(id));
    }

    @Patch('users/:id/reactivate')
    @ApiOperation({ summary: 'Réactiver un compte suspendu' })
    @ApiResponse({ status: 200, type: AdminUserResponseDto })
    async reactivateUser(@Param('id') id: string): Promise<AdminUserResponseDto> {
        return toUserDto(await this.adminService.reactivateUser(id));
    }

    @Delete('users/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Supprimer définitivement un compte' })
    @ApiResponse({ status: 204 })
    async deleteUser(@Param('id') id: string): Promise<void> {
        await this.adminService.deleteUser(id);
    }
}