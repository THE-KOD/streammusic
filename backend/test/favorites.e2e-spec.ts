import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

describe('Favorites (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    const uniqueSuffix = Date.now();
    const emailArtist = `e2e-fav-artist-${uniqueSuffix}@example.com`;
    const pseudoArtist = `e2e_fav_artist_${uniqueSuffix}`;
    const emailFan = `e2e-fav-fan-${uniqueSuffix}@example.com`;
    const pseudoFan = `e2e_fav_fan_${uniqueSuffix}`;
    const genreNom = `TestGenreFav${uniqueSuffix}`;

    let tokenFan: string;
    let trackId: string;
    let albumId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleFixture.createNestApplication();
        configureApp(app);
        dataSource = moduleFixture.get(DataSource);
        await app.init();

        // Un artiste qui publie un titre + un album, et un fan distinct qui les met en favori
        const resArtist = await request(app.getHttpServer()).post('/auth/register')
            .send({ pseudo: pseudoArtist, email: emailArtist, motDePasse: 'motDePasseSecurise123' });
        const tokenArtist = resArtist.body.accessToken;
        await request(app.getHttpServer()).post('/artists/me').set('Authorization', `Bearer ${tokenArtist}`).send({});

        const resGenre = await request(app.getHttpServer()).post('/genres')
            .set('Authorization', `Bearer ${tokenArtist}`).send({ nom: genreNom });

        const resAlbum = await request(app.getHttpServer()).post('/albums')
            .set('Authorization', `Bearer ${tokenArtist}`).send({ titre: 'Album Fav', dateSortie: '2026-01-01' });
        albumId = resAlbum.body.id;

        const resTrack = await request(app.getHttpServer()).post('/tracks')
            .set('Authorization', `Bearer ${tokenArtist}`)
            .send({ titre: 'Titre Fav', genreId: resGenre.body.id, duree: 200, fichierAudioUrl: 'https://x.com/a.mp3' });
        trackId = resTrack.body.id;

        const resFan = await request(app.getHttpServer()).post('/auth/register')
            .send({ pseudo: pseudoFan, email: emailFan, motDePasse: 'motDePasseSecurise123' });
        tokenFan = resFan.body.accessToken;
    });

    afterAll(async () => {
        // Ordre important : utilisateur d'abord (cascade vers artiste puis titre),
        // genre ensuite — sinon ON DELETE RESTRICT refuse la suppression du genre
        // tant qu'un titre le référence encore. Piège identique à celui déjà
        // rencontré et corrigé dans catalog-genres.
        await dataSource.query('DELETE FROM utilisateur WHERE email IN (?, ?)', [emailArtist, emailFan]);
        await dataSource.query('DELETE FROM genre WHERE nom = ?', [genreNom]);
        await app.close();
    });

    it('GET /favorites/tracks — refuse sans authentification', async () => {
        await request(app.getHttpServer()).get('/favorites/tracks').expect(401);
    });

    it('POST /favorites/tracks/:id — refuse un titre inexistant', async () => {
        await request(app.getHttpServer()).post('/favorites/tracks/00000000-0000-0000-0000-000000000000')
            .set('Authorization', `Bearer ${tokenFan}`).expect(404);
    });

    it('POST /favorites/tracks/:id — ajoute un titre en favori', async () => {
        await request(app.getHttpServer()).post(`/favorites/tracks/${trackId}`)
            .set('Authorization', `Bearer ${tokenFan}`).expect(204);
    });

    it('POST /favorites/tracks/:id — idempotent, un second appel ne plante pas', async () => {
        await request(app.getHttpServer()).post(`/favorites/tracks/${trackId}`)
            .set('Authorization', `Bearer ${tokenFan}`).expect(204);
    });

    it('GET /favorites/tracks — le titre apparaît dans la liste', async () => {
        const res = await request(app.getHttpServer()).get('/favorites/tracks')
            .set('Authorization', `Bearer ${tokenFan}`).expect(200);
        expect(res.body.some((t: any) => t.id === trackId)).toBe(true);
    });

    it('DELETE /favorites/tracks/:id — retire le favori', async () => {
        await request(app.getHttpServer()).delete(`/favorites/tracks/${trackId}`)
            .set('Authorization', `Bearer ${tokenFan}`).expect(204);

        const res = await request(app.getHttpServer()).get('/favorites/tracks')
            .set('Authorization', `Bearer ${tokenFan}`).expect(200);
        expect(res.body.some((t: any) => t.id === trackId)).toBe(false);
    });

    it('POST /favorites/albums/:id puis GET — sauvegarde un album', async () => {
        await request(app.getHttpServer()).post(`/favorites/albums/${albumId}`)
            .set('Authorization', `Bearer ${tokenFan}`).expect(204);

        const res = await request(app.getHttpServer()).get('/favorites/albums')
            .set('Authorization', `Bearer ${tokenFan}`).expect(200);
        expect(res.body.some((a: any) => a.id === albumId)).toBe(true);
    });
});