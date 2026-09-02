import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

describe('Uploads (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    const uniqueSuffix = Date.now();
    const testEmail = `e2e-upload-${uniqueSuffix}@example.com`;
    const testPseudo = `e2e_upload_${uniqueSuffix}`;

    let token: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleFixture.createNestApplication();
        configureApp(app);
        dataSource = moduleFixture.get(DataSource);
        await app.init();

        const res = await request(app.getHttpServer()).post('/auth/register')
            .send({ pseudo: testPseudo, email: testEmail, motDePasse: 'motDePasseSecurise123' });
        token = res.body.accessToken;
    });

    afterAll(async () => {
        await dataSource.query('DELETE FROM utilisateur WHERE email = ?', [testEmail]);
        await app.close();
    });

    it('POST /uploads/audio — refuse sans authentification', async () => {
        await request(app.getHttpServer()).post('/uploads/audio')
            .attach('file', Buffer.from('fake-audio-content'), 'test.mp3')
            .expect(401);
    });

    it('POST /uploads/image — refuse un type de fichier non autorisé', async () => {
        await request(app.getHttpServer()).post('/uploads/image')
            .set('Authorization', `Bearer ${token}`)
            .attach('file', Buffer.from('contenu'), { filename: 'malware.exe', contentType: 'application/x-msdownload' })
            .expect(400);
    });

    it('POST /uploads/image — accepte une image valide et renvoie une URL exploitable', async () => {
        const res = await request(app.getHttpServer()).post('/uploads/image')
            .set('Authorization', `Bearer ${token}`)
            .attach('file', Buffer.from('fake-png-bytes'), { filename: 'cover.png', contentType: 'image/png' })
            .expect(201);
        expect(res.body.url).toContain('/uploads/covers/');
    });
});