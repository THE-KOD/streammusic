import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

describe('Users (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    const uniqueSuffix = Date.now();
    const testEmail = `e2e-users-${uniqueSuffix}@example.com`;
    const otherEmail = `other-${uniqueSuffix}@example.com`;
    const testPseudo = `e2e_users_${uniqueSuffix}`;
    const otherPseudo = `e2e_other_${uniqueSuffix}`;
    const testPassword = 'motDePasseSecurise123';

    let accessToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        configureApp(app);
        dataSource = moduleFixture.get(DataSource);
        await app.init();

        await request(app.getHttpServer())
            .post('/auth/register')
            .send({ pseudo: otherPseudo, email: otherEmail, motDePasse: testPassword });

        const registerRes = await request(app.getHttpServer())
            .post('/auth/register')
            .send({ pseudo: testPseudo, email: testEmail, motDePasse: testPassword });
        accessToken = registerRes.body.accessToken;
    });

    afterAll(async () => {
        await dataSource.query('DELETE FROM utilisateur WHERE email IN (?, ?)', [testEmail, otherEmail]);
        await app.close();
    });

    it('GET /users/me — refuse sans token', async () => {
        await request(app.getHttpServer()).get('/users/me').expect(401);
    });

    it('GET /users/me — renvoie le profil courant', async () => {
        const res = await request(app.getHttpServer())
            .get('/users/me')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(res.body.email).toBe(testEmail);
        expect(res.body.authMethod).toBe('password');
    });

    it('PATCH /users/me — met à jour le pseudo', async () => {
        const nouveauPseudo = `${testPseudo}_v2`;
        const res = await request(app.getHttpServer())
            .patch('/users/me')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ pseudo: nouveauPseudo })
            .expect(200);

        expect(res.body.pseudo).toBe(nouveauPseudo);
    });

    it('PATCH /users/me — refuse un pseudo déjà pris', async () => {
        const res = await request(app.getHttpServer())
            .patch('/users/me')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ pseudo: otherPseudo })
            .expect(409);

        expect(res.body.error.code).toBe('CONFLICT');
    });
});