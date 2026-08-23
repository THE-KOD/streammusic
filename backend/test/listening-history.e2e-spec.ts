import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

describe('Listening History (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    const uniqueSuffix = Date.now();
    const email = `e2e-hist-${uniqueSuffix}@example.com`;
    const pseudo = `e2e_hist_${uniqueSuffix}`;
    const genreNom = `TestGenreHist${uniqueSuffix}`;

    let token: string;
    let trackId: string;

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

        const resTrack = await request(app.getHttpServer()).post('/tracks')
            .set('Authorization', `Bearer ${token}`)
            .send({ titre: 'Titre Historique', genreId: resGenre.body.id, duree: 200, fichierAudioUrl: 'https://x.com/a.mp3' });
        trackId = resTrack.body.id;
    });

    afterAll(async () => {
        await dataSource.query('DELETE FROM utilisateur WHERE email = ?', [email]);
        await dataSource.query('DELETE FROM genre WHERE nom = ?', [genreNom]);
        await app.close();
    });

    it('POST /listening-history — refuse une durée supérieure à celle du titre', async () => {
        await request(app.getHttpServer()).post('/listening-history')
            .set('Authorization', `Bearer ${token}`).send({ titreId: trackId, dureeEcoutee: 999 }).expect(400);
    });

    it("POST /listening-history — enregistre l'écoute et incrémente le compteur du titre", async () => {
        await request(app.getHttpServer()).post('/listening-history')
            .set('Authorization', `Bearer ${token}`).send({ titreId: trackId, dureeEcoutee: 150 }).expect(201);

        const track = await request(app.getHttpServer()).get(`/tracks/${trackId}`).expect(200);
        expect(track.body.nombreEcoutes).toBe(1);
    });

    it('GET /listening-history/mine — liste la nouvelle entrée', async () => {
        const res = await request(app.getHttpServer()).get('/listening-history/mine')
            .set('Authorization', `Bearer ${token}`).expect(200);
        expect(res.body.some((e: any) => e.titreId === trackId)).toBe(true);
    });

    it('DELETE /listening-history/mine — efface tout mon historique', async () => {
        await request(app.getHttpServer()).delete('/listening-history/mine')
            .set('Authorization', `Bearer ${token}`).expect(204);

        const res = await request(app.getHttpServer()).get('/listening-history/mine')
            .set('Authorization', `Bearer ${token}`).expect(200);
        expect(res.body).toHaveLength(0);
    });
});