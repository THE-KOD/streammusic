import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

describe('Playlists (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    const uniqueSuffix = Date.now();
    const emailOwner = `e2e-pl-owner-${uniqueSuffix}@example.com`;
    const pseudoOwner = `e2e_pl_owner_${uniqueSuffix}`;
    const emailOther = `e2e-pl-other-${uniqueSuffix}@example.com`;
    const pseudoOther = `e2e_pl_other_${uniqueSuffix}`;
    const genreNom = `TestGenrePlaylist${uniqueSuffix}`;

    let tokenOwner: string;
    let tokenOther: string;
    let track1Id: string;
    let track2Id: string;
    let playlistId: string;
    let publicPlaylistId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleFixture.createNestApplication();
        configureApp(app);
        dataSource = moduleFixture.get(DataSource);
        await app.init();

        const resOwner = await request(app.getHttpServer()).post('/auth/register')
            .send({ pseudo: pseudoOwner, email: emailOwner, motDePasse: 'motDePasseSecurise123' });
        tokenOwner = resOwner.body.accessToken;
        await request(app.getHttpServer()).post('/artists/me').set('Authorization', `Bearer ${tokenOwner}`).send({});
        // Retrofit nécessaire depuis le module admin : POST /genres exige un administrateur.
        await dataSource.query('INSERT INTO administrateur (id, niveau_acces) VALUES (?, ?)', [resOwner.body.utilisateur.id, 'STANDARD']);

        const resOther = await request(app.getHttpServer()).post('/auth/register')
            .send({ pseudo: pseudoOther, email: emailOther, motDePasse: 'motDePasseSecurise123' });
        tokenOther = resOther.body.accessToken;

        const resGenre = await request(app.getHttpServer()).post('/genres')
            .set('Authorization', `Bearer ${tokenOwner}`).send({ nom: genreNom });

        const resTrack1 = await request(app.getHttpServer()).post('/tracks')
            .set('Authorization', `Bearer ${tokenOwner}`)
            .send({ titre: 'Titre 1', genreId: resGenre.body.id, duree: 200, fichierAudioUrl: 'https://x.com/a.mp3' });
        track1Id = resTrack1.body.id;

        const resTrack2 = await request(app.getHttpServer()).post('/tracks')
            .set('Authorization', `Bearer ${tokenOwner}`)
            .send({ titre: 'Titre 2', genreId: resGenre.body.id, duree: 180, fichierAudioUrl: 'https://x.com/b.mp3' });
        track2Id = resTrack2.body.id;
    });

    afterAll(async () => {
        // Ordre important : utilisateur avant genre (voir l'explication du fix
        // apporté à favorites.e2e-spec.ts un peu plus tôt).
        await dataSource.query('DELETE FROM utilisateur WHERE email IN (?, ?)', [emailOwner, emailOther]);
        await dataSource.query('DELETE FROM genre WHERE nom = ?', [genreNom]);
        await app.close();
    });

    it('POST /playlists — crée une playlist privée par défaut', async () => {
        const res = await request(app.getHttpServer()).post('/playlists')
            .set('Authorization', `Bearer ${tokenOwner}`).send({ nom: 'Ma playlist' }).expect(201);
        playlistId = res.body.id;
        expect(res.body.visibilite).toBe('PRIVEE');
        expect(res.body.trackCount).toBe(0);
    });

    it("GET /playlists/:id — 404 pour un autre utilisateur (playlist privée)", async () => {
        await request(app.getHttpServer()).get(`/playlists/${playlistId}`)
            .set('Authorization', `Bearer ${tokenOther}`).expect(404);
    });

    it('POST /playlists/:id/tracks/:trackId — ajoute deux titres', async () => {
        await request(app.getHttpServer()).post(`/playlists/${playlistId}/tracks/${track1Id}`)
            .set('Authorization', `Bearer ${tokenOwner}`).expect(204);
        await request(app.getHttpServer()).post(`/playlists/${playlistId}/tracks/${track2Id}`)
            .set('Authorization', `Bearer ${tokenOwner}`).expect(204);
    });

    it('POST .../tracks/:trackId — refuse un doublon', async () => {
        await request(app.getHttpServer()).post(`/playlists/${playlistId}/tracks/${track1Id}`)
            .set('Authorization', `Bearer ${tokenOwner}`).expect(409);
    });

    it('GET /playlists/:id/tracks — les titres sont dans l\'ordre d\'ajout', async () => {
        const res = await request(app.getHttpServer()).get(`/playlists/${playlistId}/tracks`)
            .set('Authorization', `Bearer ${tokenOwner}`).expect(200);
        expect(res.body.map((t: any) => t.id)).toEqual([track1Id, track2Id]);
    });

    it('PATCH .../position — réordonne les titres', async () => {
        await request(app.getHttpServer()).patch(`/playlists/${playlistId}/tracks/${track2Id}/position`)
            .set('Authorization', `Bearer ${tokenOwner}`).send({ versPosition: 0 }).expect(204);

        const res = await request(app.getHttpServer()).get(`/playlists/${playlistId}/tracks`)
            .set('Authorization', `Bearer ${tokenOwner}`).expect(200);
        expect(res.body.map((t: any) => t.id)).toEqual([track2Id, track1Id]);
    });

    it('PATCH /playlists/:id — renomme et rend publique', async () => {
        const res = await request(app.getHttpServer()).patch(`/playlists/${playlistId}`)
            .set('Authorization', `Bearer ${tokenOwner}`)
            .send({ nom: 'Playlist renommée', visibilite: 'PUBLIQUE' }).expect(200);
        expect(res.body.nom).toBe('Playlist renommée');
        expect(res.body.visibilite).toBe('PUBLIQUE');
        publicPlaylistId = res.body.id;
    });

    it('GET /playlists/:id — accessible par un autre utilisateur une fois publique', async () => {
        await request(app.getHttpServer()).get(`/playlists/${publicPlaylistId}`)
            .set('Authorization', `Bearer ${tokenOther}`).expect(200);
    });

    it('PATCH /playlists/:id — refuse la modification par un non-propriétaire', async () => {
        await request(app.getHttpServer()).patch(`/playlists/${playlistId}`)
            .set('Authorization', `Bearer ${tokenOther}`).send({ nom: 'Vol' }).expect(403);
    });

    it('DELETE .../tracks/:trackId — retire un titre', async () => {
        await request(app.getHttpServer()).delete(`/playlists/${playlistId}/tracks/${track1Id}`)
            .set('Authorization', `Bearer ${tokenOwner}`).expect(204);

        const res = await request(app.getHttpServer()).get(`/playlists/${playlistId}/tracks`)
            .set('Authorization', `Bearer ${tokenOwner}`).expect(200);
        expect(res.body).toHaveLength(1);
    });

    it('DELETE /playlists/:id — supprime la playlist', async () => {
        await request(app.getHttpServer()).delete(`/playlists/${playlistId}`)
            .set('Authorization', `Bearer ${tokenOwner}`).expect(204);
        await request(app.getHttpServer()).get(`/playlists/${playlistId}`)
            .set('Authorization', `Bearer ${tokenOwner}`).expect(404);
    });
});