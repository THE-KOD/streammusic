import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

describe('Notifications (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    const uniqueSuffix = Date.now();
    const emailArtist = `e2e-notif-artist-${uniqueSuffix}@example.com`;
    const pseudoArtist = `e2e_notif_artist_${uniqueSuffix}`;
    const emailFan = `e2e-notif-fan-${uniqueSuffix}@example.com`;
    const pseudoFan = `e2e_notif_fan_${uniqueSuffix}`;
    const genreNom = `TestGenreNotif${uniqueSuffix}`;

    let tokenArtist: string;
    let artistId: string;
    let tokenFan: string;
    let trackId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleFixture.createNestApplication();
        configureApp(app);
        dataSource = moduleFixture.get(DataSource);
        await app.init();

        const resArtist = await request(app.getHttpServer()).post('/auth/register')
            .send({ pseudo: pseudoArtist, email: emailArtist, motDePasse: 'motDePasseSecurise123' });
        tokenArtist = resArtist.body.accessToken;
        artistId = resArtist.body.utilisateur.id;
        await request(app.getHttpServer()).post('/artists/me').set('Authorization', `Bearer ${tokenArtist}`).send({});

        const resFan = await request(app.getHttpServer()).post('/auth/register')
            .send({ pseudo: pseudoFan, email: emailFan, motDePasse: 'motDePasseSecurise123' });
        tokenFan = resFan.body.accessToken;
        await request(app.getHttpServer()).post(`/follows/${artistId}`).set('Authorization', `Bearer ${tokenFan}`);

        const resGenre = await request(app.getHttpServer()).post('/genres')
            .set('Authorization', `Bearer ${tokenArtist}`).send({ nom: genreNom });

        const resTrack = await request(app.getHttpServer()).post('/tracks')
            .set('Authorization', `Bearer ${tokenArtist}`)
            .send({ titre: 'Nouvelle Sortie', genreId: resGenre.body.id, duree: 200, fichierAudioUrl: 'https://x.com/a.mp3' });
        trackId = resTrack.body.id;
    });

    afterAll(async () => {
        await dataSource.query('DELETE FROM utilisateur WHERE email IN (?, ?)', [emailArtist, emailFan]);
        await dataSource.query('DELETE FROM genre WHERE nom = ?', [genreNom]);
        await app.close();
    });

    it('GET /notifications/mine — vide avant toute sortie validée', async () => {
        const res = await request(app.getHttpServer()).get('/notifications/mine')
            .set('Authorization', `Bearer ${tokenFan}`).expect(200);
        expect(res.body).toEqual([]);
    });

    it("la validation d'un titre notifie les followers de l'artiste", async () => {
        await request(app.getHttpServer()).patch(`/tracks/${trackId}/moderer`)
            .set('Authorization', `Bearer ${tokenArtist}`).send({ statut: 'VALIDE' }).expect(200);

        // L'événement est traité de façon asynchrone (fire-and-forget, voir
        // TracksService.moderer()) — courte pause pour laisser le listener s'exécuter.
        await new Promise((resolve) => setTimeout(resolve, 300));

        const res = await request(app.getHttpServer()).get('/notifications/mine')
            .set('Authorization', `Bearer ${tokenFan}`).expect(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].type).toBe('NOUVELLE_SORTIE');
        expect(res.body[0].titreId).toBe(trackId);
    });

    it('GET /notifications/mine/unread-count — 1 notification non lue', async () => {
        const res = await request(app.getHttpServer()).get('/notifications/mine/unread-count')
            .set('Authorization', `Bearer ${tokenFan}`).expect(200);
        expect(res.body.count).toBe(1);
    });

    it('PATCH /notifications/mine/read-all — marque tout comme lu', async () => {
        await request(app.getHttpServer()).patch('/notifications/mine/read-all')
            .set('Authorization', `Bearer ${tokenFan}`).expect(204);
        const res = await request(app.getHttpServer()).get('/notifications/mine/unread-count')
            .set('Authorization', `Bearer ${tokenFan}`).expect(200);
        expect(res.body.count).toBe(0);
    });
});