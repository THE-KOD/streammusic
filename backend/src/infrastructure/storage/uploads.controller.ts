import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { UPLOADS_ROOT } from './uploads.constants';

const AUDIO_MIME_TYPES = ['audio/mpeg', 'audio/ogg', 'audio/wav'];
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_AUDIO_SIZE = 20 * 1024 * 1024;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// Rejette le fichier AVANT de l'écrire sur disque si le type MIME n'est
// pas autorisé — plus sûr que de valider après coup (le fichier aurait
// déjà été écrit).
function buildMulterOptions(subfolder: string, allowedMimes: string[], maxSize: number) {
    return {
        storage: diskStorage({
            destination: join(UPLOADS_ROOT, subfolder),
            filename: (_req: unknown, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
                cb(null, `${randomUUID()}${extname(file.originalname)}`);
            },
        }),
        fileFilter: (_req: unknown, file: Express.Multer.File, cb: (error: Error | null, accept: boolean) => void) => {
            if (!allowedMimes.includes(file.mimetype)) return cb(new BadRequestException('Format de fichier non supporté.'), false);
            cb(null, true);
        },
        limits: { fileSize: maxSize },
    };
}

@ApiTags('uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // uploader nécessite d'être connecté, quel que soit le type de fichier
@Controller('uploads')
export class UploadsController {
    constructor(private readonly config: ConfigService) {}

    private toPublicUrl(subfolder: string, filename: string): string {
        const base = this.config.get<string>('BACKEND_PUBLIC_URL') ?? `http://localhost:${this.config.get('PORT') ?? 3000}`;
        return `${base}/uploads/${subfolder}/${filename}`;
    }

    @Post('audio')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Uploader un fichier audio (stockage local)' })
    @ApiResponse({ status: 201, schema: { properties: { url: { type: 'string' } } } })
    @UseInterceptors(FileInterceptor('file', buildMulterOptions('tracks', AUDIO_MIME_TYPES, MAX_AUDIO_SIZE)))
    uploadAudio(@UploadedFile() file: Express.Multer.File): { url: string } {
        if (!file) throw new BadRequestException('Aucun fichier reçu.');
        return { url: this.toPublicUrl('tracks', file.filename) };
    }

    @Post('image')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: "Uploader une image (pochette, avatar...) — stockage local" })
    @ApiResponse({ status: 201, schema: { properties: { url: { type: 'string' } } } })
    @UseInterceptors(FileInterceptor('file', buildMulterOptions('covers', IMAGE_MIME_TYPES, MAX_IMAGE_SIZE)))
    uploadImage(@UploadedFile() file: Express.Multer.File): { url: string } {
        if (!file) throw new BadRequestException('Aucun fichier reçu.');
        return { url: this.toPublicUrl('covers', file.filename) };
    }
}