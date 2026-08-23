import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

describe('Queue (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    const uniqueSuffix = Date.now();
    const email = `e2e-queue-${uniqueSuffix}@example.com`;
    const pseudo = `e2e_queue_${uniqueSuffix}`;
    const genreNom = `TestGenreQueue${uniqueSuffix}`;

    let token: string;
    let track1Id: string;
    let track2Id: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleFixture.createNestApplication();
        configureApp(app);
        dataSource = moduleFixture.get(DataSource);
        await app.init();

        const res = await request(app.getHttpServer()).post('/auth/register')
            .send({ pseudo, email, motDePasse: 'motDePasseSecurise123' });
        token = res.body.accessToken;
        await request(app.getHttpServer()).post('/artists/me').set('Authorization', `Bearer ${token}`).send({});

        const resGenre = await request(app.getHttpServer()).post('/genres')
            .set('Authorization', `Bearer ${token}`).send({ nom: genreNom });

        const resTrack1 = await request(app.getHttpServer()).post('/tracks')
            .set('Authorization', `Bearer ${token}`)
            .send({ titre: 'Queue Titre 1', genreId: resGenre.body.id, duree: 200, fichierAudioUrl: 'https://x.com/a.mp3' });
        track1Id = resTrack1.body.id;

        const resTrack2 = await request(app.getHttpServer()).post('/tracks')
            .set('Authorization', `Bearer ${token}`)
            .send({ titre: 'Queue Titre 2', genreId: resGenre.body.id, duree: 180, fichierAudioUrl: 'https://x.com/b.mp3' });
        track2Id = resTrack2.body.id;
    });

    afterAll(async () => {
        await dataSource.query('DELETE FROM utilisateur WHERE email = ?', [email]);
        await dataSource.query('DELETE FROM genre WHERE nom = ?', [genreNom]);
        await app.close();
    });

    it("GET /queue — liste vide avant tout ajout (pas d'erreur)", async () => {
        const res = await request(app.getHttpServer()).get('/queue')
            .set('Authorization', `Bearer ${token}`).expect(200);
        expect(res.body).toEqual([]);
    });

    it("POST /queue/:trackId — cree la file au premier ajout", async () => {
        await request(app.getHttpServer()).post(`/queue/${track1Id}`)
            .set('Authorization', `Bearer ${token}`).expect(204);
        await request(app.getHttpServer()).post(`/queue/${track2Id}`)
            .set('Authorization', `Bearer ${token}`).expect(204);
    });

    it('POST /queue/:trackId — refuse un doublon', async () => {
        await request(app.getHttpServer()).post(`/queue/${track1Id}`)
            .set('Authorization', `Bearer ${token}`).expect(409);
    });

    it("GET /queue — les titres sont dans l'ordre d'ajout", async () => {
        const res = await request(app.getHttpServer()).get('/queue')
            .set('Authorization', `Bearer ${token}`).expect(200);
        expect(res.body.map((t: any) => t.titreId)).toEqual([track1Id, track2Id]);
    });

    it('PATCH .../position — reordonne', async () => {
        await request(app.getHttpServer()).patch(`/queue/${track2Id}/position`)
            .set('Authorization', `Bearer ${token}`).send({ versPosition: 0 }).expect(204);

        const res = await request(app.getHttpServer()).get('/queue')
            .set('Authorization', `Bearer ${token}`).expect(200);
        expect(res.body.map((t: any) => t.titreId)).toEqual([track2Id, track1Id]);
    });

    it('DELETE /queue/:trackId — retire un titre', async () => {
        await request(app.getHttpServer()).delete(`/queue/${track1Id}`)
            .set('Authorization', `Bearer ${token}`).expect(204);

        const res = await request(app.getHttpServer()).get('/queue')
            .set('Authorization', `Bearer ${token}`).expect(200);
        expect(res.body).toHaveLength(1);
    });

    it('DELETE /queue — vide entierement la file', async () => {
        await request(app.getHttpServer()).delete('/queue')
            .set('Authorization', `Bearer ${token}`).expect(204);

        const res = await request(app.getHttpServer()).get('/queue')
            .set('Authorization', `Bearer ${token}`).expect(200);
        expect(res.body).toEqual([]);
    });
});