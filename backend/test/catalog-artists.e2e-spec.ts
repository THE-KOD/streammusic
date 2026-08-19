import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

describe('Catalog Artists (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    const uniqueSuffix = Date.now();
    const emailA = `e2e-artist-a-${uniqueSuffix}@example.com`;
    const pseudoA = `e2e_artist_a_${uniqueSuffix}`;
    const emailB = `e2e-artist-b-${uniqueSuffix}@example.com`;
    const pseudoB = `e2e_artist_b_${uniqueSuffix}`;

    let tokenA: string;
    let userIdA: string;
    let tokenB: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleFixture.createNestApplication();
        configureApp(app);
        dataSource = moduleFixture.get(DataSource);
        await app.init();

        // Deux comptes distincts : A devient artiste, B sert à tester le refus
        // de modification d'un profil qui n'est pas le sien.
        const resA = await request(app.getHttpServer())
            .post('/auth/register')
            .send({ pseudo: pseudoA, email: emailA, motDePasse: 'motDePasseSecurise123' });
        tokenA = resA.body.accessToken;
        userIdA = resA.body.utilisateur.id;

        const resB = await request(app.getHttpServer())
            .post('/auth/register')
            .send({ pseudo: pseudoB, email: emailB, motDePasse: 'motDePasseSecurise123' });
        tokenB = resB.body.accessToken;
    });

    afterAll(async () => {
        // Supprimer l'utilisateur suffit : ON DELETE CASCADE nettoie
        // automatiquement le profil artiste associé.
        await dataSource.query('DELETE FROM utilisateur WHERE email IN (?, ?)', [emailA, emailB]);
        await app.close();
    });

    it('GET /artists — accessible sans authentification', async () => {
        await request(app.getHttpServer()).get('/artists').expect(200);
    });

    it('POST /artists/me — refuse sans authentification', async () => {
        await request(app.getHttpServer()).post('/artists/me').send({ biographie: 'Test' }).expect(401);
    });

    it('POST /artists/me — cree le profil artiste', async () => {
        const res = await request(app.getHttpServer())
            .post('/artists/me')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ biographie: 'Artiste de test', photoArtisteUrl: 'https://cdn.example.com/a.jpg' })
            .expect(201);

        expect(res.body.id).toBe(userIdA);
        expect(res.body.pseudo).toBe(pseudoA);
    });

    it('POST /artists/me — refuse un second profil pour le meme utilisateur', async () => {
        const res = await request(app.getHttpServer())
            .post('/artists/me')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ biographie: 'Nouvelle tentative' })
            .expect(409);

        expect(res.body.error.code).toBe('CONFLICT');
    });

    it('GET /artists/:id — consulte le profil cree', async () => {
        const res = await request(app.getHttpServer()).get(`/artists/${userIdA}`).expect(200);
        expect(res.body.pseudo).toBe(pseudoA);
    });

    it('PATCH /artists/:id — le proprietaire peut modifier son profil', async () => {
        const res = await request(app.getHttpServer())
            .patch(`/artists/${userIdA}`)
            .set('Authorization', `Bearer ${tokenA}`)
            .send({ biographie: 'Bio mise a jour' })
            .expect(200);

        expect(res.body.biographie).toBe('Bio mise a jour');
    });

    it('PATCH /artists/:id — refuse la modification par un autre compte', async () => {
        const res = await request(app.getHttpServer())
            .patch(`/artists/${userIdA}`)
            .set('Authorization', `Bearer ${tokenB}`)
            .send({ biographie: 'Tentative malveillante' })
            .expect(403);

        expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('GET /artists/:id — 404 pour un id inexistant', async () => {
        await request(app.getHttpServer()).get('/artists/00000000-0000-0000-0000-000000000000').expect(404);
    });
});