import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

describe('Follows (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    const uniqueSuffix = Date.now();
    const emailArtist = `e2e-follow-artist-${uniqueSuffix}@example.com`;
    const pseudoArtist = `e2e_follow_artist_${uniqueSuffix}`;
    const emailFan = `e2e-follow-fan-${uniqueSuffix}@example.com`;
    const pseudoFan = `e2e_follow_fan_${uniqueSuffix}`;

    let tokenFan: string;
    let artistId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleFixture.createNestApplication();
        configureApp(app);
        dataSource = moduleFixture.get(DataSource);
        await app.init();

        const resArtist = await request(app.getHttpServer()).post('/auth/register')
            .send({ pseudo: pseudoArtist, email: emailArtist, motDePasse: 'motDePasseSecurise123' });
        artistId = resArtist.body.utilisateur.id;
        await request(app.getHttpServer()).post('/artists/me')
            .set('Authorization', `Bearer ${resArtist.body.accessToken}`).send({});

        const resFan = await request(app.getHttpServer()).post('/auth/register')
            .send({ pseudo: pseudoFan, email: emailFan, motDePasse: 'motDePasseSecurise123' });
        tokenFan = resFan.body.accessToken;
    });

    afterAll(async () => {
        await dataSource.query('DELETE FROM utilisateur WHERE email IN (?, ?)', [emailArtist, emailFan]);
        await app.close();
    });

    it('GET /follows/:id/status — false avant de suivre', async () => {
        const res = await request(app.getHttpServer()).get(`/follows/${artistId}/status`)
            .set('Authorization', `Bearer ${tokenFan}`).expect(200);
        expect(res.body.isFollowing).toBe(false);
    });

    it('POST /follows/:id — refuse de se suivre soi-même', async () => {
        // Ici, le "soi-même" est le fan qui essaie de se suivre lui-même —
        // artisteId = son propre id (peu importe qu'il ait ou non un profil artiste,
        // la règle se déclenche avant toute vérification d'existence).
        const meRes = await request(app.getHttpServer()).get('/users/me').set('Authorization', `Bearer ${tokenFan}`);
        await request(app.getHttpServer()).post(`/follows/${meRes.body.id}`)
            .set('Authorization', `Bearer ${tokenFan}`).expect(400);
    });

    it('POST /follows/:id — refuse un artiste inexistant', async () => {
        await request(app.getHttpServer()).post('/follows/00000000-0000-0000-0000-000000000000')
            .set('Authorization', `Bearer ${tokenFan}`).expect(404);
    });

    it('POST /follows/:id — suit un artiste existant', async () => {
        await request(app.getHttpServer()).post(`/follows/${artistId}`)
            .set('Authorization', `Bearer ${tokenFan}`).expect(204);
    });

    it('GET /follows/:id/status — true après avoir suivi', async () => {
        const res = await request(app.getHttpServer()).get(`/follows/${artistId}/status`)
            .set('Authorization', `Bearer ${tokenFan}`).expect(200);
        expect(res.body.isFollowing).toBe(true);
    });

    it('GET /follows — liste les artistes suivis avec leur pseudo', async () => {
        const res = await request(app.getHttpServer()).get('/follows')
            .set('Authorization', `Bearer ${tokenFan}`).expect(200);
        expect(res.body).toContainEqual({ id: artistId, pseudo: pseudoArtist });
    });

    it('DELETE /follows/:id — ne suit plus l\'artiste', async () => {
        await request(app.getHttpServer()).delete(`/follows/${artistId}`)
            .set('Authorization', `Bearer ${tokenFan}`).expect(204);

        const res = await request(app.getHttpServer()).get(`/follows/${artistId}/status`)
            .set('Authorization', `Bearer ${tokenFan}`).expect(200);
        expect(res.body.isFollowing).toBe(false);
    });
});