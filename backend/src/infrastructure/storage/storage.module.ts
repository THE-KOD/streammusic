import { Module } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { UploadsController } from './uploads.controller';
import { UPLOADS_ROOT } from './uploads.constants';

// Crée les sous-dossiers au démarrage du module — évite une erreur au
// premier upload si le dossier n'existe pas encore sur une machine neuve.
for (const sub of ['tracks', 'covers']) {
    const dir = join(UPLOADS_ROOT, sub);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

@Module({
    controllers: [UploadsController],
})
export class StorageModule {}