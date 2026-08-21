import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

describe('Catalog Albums (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    const uniqueSuffix = Date.now();
    const emailArtist = `e2e-album-artist-${uniqueSuffix}@example.com`;
    const pseudoArtist = `e2e_album_artist_${uniqueSuffix}`;
    const emailOther = `e2e-album-other-${uniqueSuffix}@example.com`;
    const pseudoOther = `e2e_album_other_${uniqueSuffix}`;
    const emailNonArtist = `e2e-album-nonartist-${uniqueSuffix}@example.com`;
    const pseudoNonArtist = `e2e_album_nonartist_${uniqueSuffix}`;

    let tokenArtist: string;
    let artistId: string;
    let tokenOther: string;
    let tokenNonArtist: string;
    let albumId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleFixture.createNestApplication();
        configureApp(app);
        dataSource = moduleFixture.get(DataSource);
        await app.init();

        // Artiste principal — celui qui crée et possède l'album testé
        const resArtist = await request(app.getHttpServer()).post('/auth/register')
            .send({ pseudo: pseudoArtist, email: emailArtist, motDePasse: 'motDePasseSecurise123' });
        tokenArtist = resArtist.body.accessToken;
        artistId = resArtist.body.utilisateur.id;
        await request(app.getHttpServer()).post('/artists/me')
            .set('Authorization', `Bearer ${tokenArtist}`).send({ biographie: 'Bio' });

        // Second artiste — sert uniquement à tester le refus de modification d'un album qui n'est pas le sien
        const resOther = await request(app.getHttpServer()).post('/auth/register')
            .send({ pseudo: pseudoOther, email: emailOther, motDePasse: 'motDePasseSecurise123' });
        tokenOther = resOther.body.accessToken;
        await request(app.getHttpServer()).post('/artists/me')
            .set('Authorization', `Bearer ${tokenOther}`).send({});

        // Utilisateur connecté mais jamais devenu artiste — teste le refus de création sans profil artiste
        const resNonArtist = await request(app.getHttpServer()).post('/auth/register')
            .send({ pseudo: pseudoNonArtist, email: emailNonArtist, motDePasse: 'motDePasseSecurise123' });
        tokenNonArtist = resNonArtist.body.accessToken;
    });

    afterAll(async () => {
        await dataSource.query('DELETE FROM utilisateur WHERE email IN (?, ?, ?)', [emailArtist, emailOther, emailNonArtist]);
        await app.close();
    });

    it('POST /albums — refuse un utilisateur sans profil artiste', async () => {
        const res = await request(app.getHttpServer()).post('/albums')
            .set('Authorization', `Bearer ${tokenNonArtist}`)
            .send({ titre: 'Album impossible', dateSortie: '2026-01-01' })
            .expect(404);
        expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('POST /albums — refuse une date invalide', async () => {
        await request(app.getHttpServer()).post('/albums')
            .set('Authorization', `Bearer ${tokenArtist}`)
            .send({ titre: 'Album', dateSortie: 'pas-une-date' })
            .expect(400);
    });

    it("POST /albums — crée un album pour l'artiste connecté", async () => {
        const res = await request(app.getHttpServer()).post('/albums')
            .set('Authorization', `Bearer ${tokenArtist}`)
            .send({ titre: 'Neon Static', dateSortie: '2026-03-14', pochetteUrl: 'https://cdn.example.com/a.jpg' })
            .expect(201);
        albumId = res.body.id;
        expect(res.body.artisteId).toBe(artistId);
    });

    it('GET /albums?artisteId= — filtre par artiste', async () => {
        const res = await request(app.getHttpServer()).get(`/albums?artisteId=${artistId}`).expect(200);
        expect(res.body.some((a: any) => a.id === albumId)).toBe(true);
    });

    it("GET /albums/:id — consulte l'album", async () => {
        const res = await request(app.getHttpServer()).get(`/albums/${albumId}`).expect(200);
        expect(res.body.titre).toBe('Neon Static');
    });

    it('PATCH /albums/:id — le propriétaire peut modifier', async () => {
        const res = await request(app.getHttpServer()).patch(`/albums/${albumId}`)
            .set('Authorization', `Bearer ${tokenArtist}`)
            .send({ titre: 'Neon Static (Deluxe)' })
            .expect(200);
        expect(res.body.titre).toBe('Neon Static (Deluxe)');
    });

    it('PATCH /albums/:id — refuse un autre artiste', async () => {
        const res = await request(app.getHttpServer()).patch(`/albums/${albumId}`)
            .set('Authorization', `Bearer ${tokenOther}`)
            .send({ titre: 'Vol de titre' })
            .expect(403);
        expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('DELETE /albums/:id — refuse un autre artiste', async () => {
        await request(app.getHttpServer()).delete(`/albums/${albumId}`)
            .set('Authorization', `Bearer ${tokenOther}`).expect(403);
    });

    it('DELETE /albums/:id — le propriétaire peut supprimer', async () => {
        await request(app.getHttpServer()).delete(`/albums/${albumId}`)
            .set('Authorization', `Bearer ${tokenArtist}`).expect(204);
    });

    it('GET /albums/:id — 404 après suppression', async () => {
        await request(app.getHttpServer()).get(`/albums/${albumId}`).expect(404);
    });
});