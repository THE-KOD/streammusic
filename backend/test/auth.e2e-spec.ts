import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

describe('Auth (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    const uniqueSuffix = Date.now();
    const testEmail = `e2e-${uniqueSuffix}@example.com`;
    const testPseudo = `e2e_user_${uniqueSuffix}`;
    const testPassword = 'motDePasseSecurise123';

    let accessToken: string;
    let refreshToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        configureApp(app);
        dataSource = moduleFixture.get(DataSource);
        await app.init();
    });

    afterAll(async () => {
        // Nettoyage : le CASCADE du schéma supprime aussi les sessions liées
        await dataSource.query('DELETE FROM utilisateur WHERE email = ?', [testEmail]);
        await app.close();
    });

    it('POST /auth/register — crée un compte', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/register')
            .send({ pseudo: testPseudo, email: testEmail, motDePasse: testPassword })
            .expect(201);

        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
        expect(res.body.utilisateur.email).toBe(testEmail);
    });

    it('POST /auth/register — refuse un email déjà utilisé', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/register')
            .send({ pseudo: 'autre_pseudo', email: testEmail, motDePasse: testPassword })
            .expect(409);

        expect(res.body.error.code).toBe('CONFLICT');
    });

    it('POST /auth/register — refuse une entrée invalide', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/register')
            .send({ pseudo: 'ab', email: 'pas-un-email', motDePasse: '123' })
            .expect(400);

        expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('POST /auth/login — connecte avec les bons identifiants', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: testEmail, motDePasse: testPassword })
            .expect(200);

        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
        expect(accessToken).toBeDefined();
    });

    it('POST /auth/login — refuse un mauvais mot de passe', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: testEmail, motDePasse: 'mauvais-mot-de-passe' })
            .expect(401);

        expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('POST /auth/refresh — renouvelle les tokens (rotation)', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/refresh')
            .send({ refreshToken })
            .expect(200);

        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).not.toBe(refreshToken);
    });

    it('POST /auth/refresh — refuse un refresh token déjà utilisé', async () => {
        // Le token de cette variable a déjà été révoqué par le test précédent
        await request(app.getHttpServer())
            .post('/auth/refresh')
            .send({ refreshToken })
            .expect(401);
    });

    it('POST /auth/logout — refuse sans token', async () => {
        await request(app.getHttpServer()).post('/auth/logout').expect(401);
    });

    it('POST /auth/logout — déconnecte avec un token valide', async () => {
        await request(app.getHttpServer())
            .post('/auth/logout')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(204);
    });
});