import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

describe('Subscriptions (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    const uniqueSuffix = Date.now();
    const testEmail = `e2e-sub-${uniqueSuffix}@example.com`;
    const testPseudo = `e2e_sub_${uniqueSuffix}`;

    let accessToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleFixture.createNestApplication();
        configureApp(app);
        dataSource = moduleFixture.get(DataSource);
        await app.init();

        const res = await request(app.getHttpServer())
            .post('/auth/register')
            .send({ pseudo: testPseudo, email: testEmail, motDePasse: 'motDePasseSecurise123' });
        accessToken = res.body.accessToken;
    });

    afterAll(async () => {
        // ON DELETE CASCADE nettoie automatiquement l'abonnement associé.
        await dataSource.query('DELETE FROM utilisateur WHERE email = ?', [testEmail]);
        await app.close();
    });

    it('GET /subscriptions/me — refuse sans authentification', async () => {
        await request(app.getHttpServer()).get('/subscriptions/me').expect(401);
    });

    it("GET /subscriptions/me — l'inscription a bien creé un abonnement GRATUIT automatiquement", async () => {
        const res = await request(app.getHttpServer())
            .get('/subscriptions/me')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(res.body.type).toBe('GRATUIT');
        expect(res.body.dateFin).toBeNull();
    });

    it('POST /subscriptions/me/upgrade — passe en PREMIUM avec une dateFin fixée', async () => {
        const res = await request(app.getHttpServer())
            .post('/subscriptions/me/upgrade')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(res.body.type).toBe('PREMIUM');
        expect(res.body.dateFin).not.toBeNull();
    });

    it('GET /subscriptions/me — reflete bien le changement vers PREMIUM', async () => {
        const res = await request(app.getHttpServer())
            .get('/subscriptions/me')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(res.body.type).toBe('PREMIUM');
    });

    it('POST /subscriptions/me/downgrade — revient a GRATUIT', async () => {
        const res = await request(app.getHttpServer())
            .post('/subscriptions/me/downgrade')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(res.body.type).toBe('GRATUIT');
        expect(res.body.dateFin).toBeNull();
    });
});