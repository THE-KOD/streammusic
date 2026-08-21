import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

describe('Catalog Tracks (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    const uniqueSuffix = Date.now();
    const emailArtist = `e2e-track-artist-${uniqueSuffix}@example.com`;
    const pseudoArtist = `e2e_track_artist_${uniqueSuffix}`;
    const emailOther = `e2e-track-other-${uniqueSuffix}@example.com`;
    const pseudoOther = `e2e_track_other_${uniqueSuffix}`;
    const genreNom = `TestGenreTrack${uniqueSuffix}`;

    let tokenArtist: string;
    let artistId: string;
    let tokenOther: string;
    let genreId: string;
    let ownAlbumId: string;
    let otherArtistAlbumId: string;
    let trackId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleFixture.createNestApplication();
        configureApp(app);
        dataSource = moduleFixture.get(DataSource);
        await app.init();

        // Artiste principal
        const resArtist = await request(app.getHttpServer()).post('/auth/register')
            .send({ pseudo: pseudoArtist, email: emailArtist, motDePasse: 'motDePasseSecurise123' });
        tokenArtist = resArtist.body.accessToken;
        artistId = resArtist.body.utilisateur.id;
        await request(app.getHttpServer()).post('/artists/me')
            .set('Authorization', `Bearer ${tokenArtist}`).send({});

        // Second artiste — pour tester le refus d'ajout de titre dans son album
        const resOther = await request(app.getHttpServer()).post('/auth/register')
            .send({ pseudo: pseudoOther, email: emailOther, motDePasse: 'motDePasseSecurise123' });
        tokenOther = resOther.body.accessToken;
        await request(app.getHttpServer()).post('/artists/me')
            .set('Authorization', `Bearer ${tokenOther}`).send({});

        const resGenre = await request(app.getHttpServer()).post('/genres')
            .set('Authorization', `Bearer ${tokenArtist}`).send({ nom: genreNom });
        genreId = resGenre.body.id;

        const resAlbum = await request(app.getHttpServer()).post('/albums')
            .set('Authorization', `Bearer ${tokenArtist}`).send({ titre: 'Album Test', dateSortie: '2026-01-01' });
        ownAlbumId = resAlbum.body.id;

        const resOtherAlbum = await request(app.getHttpServer()).post('/albums')
            .set('Authorization', `Bearer ${tokenOther}`).send({ titre: 'Album Autre', dateSortie: '2026-01-01' });
        otherArtistAlbumId = resOtherAlbum.body.id;
    });

    afterAll(async () => {
        await dataSource.query('DELETE FROM genre WHERE nom = ?', [genreNom]);
        await dataSource.query('DELETE FROM utilisateur WHERE email IN (?, ?)', [emailArtist, emailOther]);
        await app.close();
    });

    it("POST /tracks — refuse d'ajouter un titre dans l'album d'un autre artiste", async () => {
        const res = await request(app.getHttpServer()).post('/tracks')
            .set('Authorization', `Bearer ${tokenArtist}`)
            .send({ titre: 'Intrus', genreId, albumId: otherArtistAlbumId, duree: 200, fichierAudioUrl: 'https://x.com/a.mp3' })
            .expect(403);
        expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('POST /tracks — refuse une durée invalide', async () => {
        await request(app.getHttpServer()).post('/tracks')
            .set('Authorization', `Bearer ${tokenArtist}`)
            .send({ titre: 'Invalide', genreId, duree: 0, fichierAudioUrl: 'https://x.com/a.mp3' })
            .expect(400);
    });

    it('POST /tracks — crée un titre en single, statut EN_ATTENTE', async () => {
        const res = await request(app.getHttpServer()).post('/tracks')
            .set('Authorization', `Bearer ${tokenArtist}`)
            .send({ titre: 'Midnight Drive', genreId, albumId: ownAlbumId, duree: 222, fichierAudioUrl: 'https://x.com/a.mp3' })
            .expect(201);
        trackId = res.body.id;
        expect(res.body.statutModeration).toBe('EN_ATTENTE');
    });

    it('GET /tracks — le catalogue public ne montre pas un titre EN_ATTENTE', async () => {
        const res = await request(app.getHttpServer()).get(`/tracks?artisteId=${artistId}`).expect(200);
        expect(res.body.find((t: any) => t.id === trackId)).toBeUndefined();
    });

    it("GET /tracks/mine — l'artiste voit son propre titre malgré le statut EN_ATTENTE", async () => {
        const res = await request(app.getHttpServer()).get('/tracks/mine')
            .set('Authorization', `Bearer ${tokenArtist}`).expect(200);
        expect(res.body.find((t: any) => t.id === trackId)).toBeDefined();
    });

    it('PATCH /tracks/:id/moderer — valide le titre', async () => {
        const res = await request(app.getHttpServer()).patch(`/tracks/${trackId}/moderer`)
            .set('Authorization', `Bearer ${tokenArtist}`)
            .send({ statut: 'VALIDE' })
            .expect(200);
        expect(res.body.statutModeration).toBe('VALIDE');
    });

    it('GET /tracks — le titre validé apparaît maintenant dans le catalogue public', async () => {
        const res = await request(app.getHttpServer()).get(`/tracks?artisteId=${artistId}`).expect(200);
        expect(res.body.find((t: any) => t.id === trackId)).toBeDefined();
    });

    it('PATCH /tracks/:id — modifier un titre validé le repasse en EN_ATTENTE', async () => {
        const res = await request(app.getHttpServer()).patch(`/tracks/${trackId}`)
            .set('Authorization', `Bearer ${tokenArtist}`)
            .send({ titre: 'Midnight Drive (Remix)' })
            .expect(200);
        expect(res.body.statutModeration).toBe('EN_ATTENTE');
    });

    it('PATCH /tracks/:id — refuse la modification par un autre artiste', async () => {
        await request(app.getHttpServer()).patch(`/tracks/${trackId}`)
            .set('Authorization', `Bearer ${tokenOther}`)
            .send({ titre: 'Vol' })
            .expect(403);
    });

    it('DELETE /tracks/:id — le propriétaire peut supprimer', async () => {
        await request(app.getHttpServer()).delete(`/tracks/${trackId}`)
            .set('Authorization', `Bearer ${tokenArtist}`).expect(204);
    });

    it('GET /tracks/:id — 404 après suppression', async () => {
        await request(app.getHttpServer()).get(`/tracks/${trackId}`).expect(404);
    });
});