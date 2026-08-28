import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

describe('Suggestions (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    const uniqueSuffix = Date.now();
    const email = `e2e-sugg-${uniqueSuffix}@example.com`;
    const pseudo = `e2e_sugg_${uniqueSuffix}`;
    const genreNom = `TestGenreSugg${uniqueSuffix}`;

    let token: string;
    let listenedTrackId: string;
    let candidateTrackId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        configureApp(app);
        dataSource = moduleFixture.get(DataSource);

        await app.init();

        const res = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                pseudo,
                email,
                motDePasse: 'motDePasseSecurise123',
            });

        token = res.body.accessToken;
        const userId = res.body.utilisateur.id;

        await request(app.getHttpServer())
            .post('/artists/me')
            .set('Authorization', `Bearer ${token}`)
            .send({});

        // POST /genres et PATCH /tracks/:id/moderer sont protégés
        // par AdminGuard. Le même utilisateur de test est donc promu admin.
        await dataSource.query(
            'INSERT INTO administrateur (id, niveau_acces) VALUES (?, ?)',
            [userId, 'STANDARD'],
        );

        const resGenre = await request(app.getHttpServer())
            .post('/genres')
            .set('Authorization', `Bearer ${token}`)
            .send({ nom: genreNom });

        const resListened = await request(app.getHttpServer())
            .post('/tracks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                titre: 'Deja Ecoute',
                genreId: resGenre.body.id,
                duree: 200,
                fichierAudioUrl: 'https://x.com/a.mp3',
            });

        listenedTrackId = resListened.body.id;

        await request(app.getHttpServer())
            .patch(`/tracks/${listenedTrackId}/moderer`)
    .set('Authorization', `Bearer ${token}`)
    .send({ statut: 'VALIDE' });

const resCandidate = await request(app.getHttpServer())
    .post('/tracks')
    .set('Authorization', `Bearer ${token}`)
    .send({
        titre: 'Candidat Suggestion',
        genreId: resGenre.body.id,
        duree: 180,
        fichierAudioUrl: 'https://x.com/b.mp3',
    });

candidateTrackId = resCandidate.body.id;

await request(app.getHttpServer())
    .patch(`/tracks/${candidateTrackId}/moderer`)
    .set('Authorization', `Bearer ${token}`)
    .send({ statut: 'VALIDE' });

await request(app.getHttpServer())
    .post('/listening-history')
    .set('Authorization', `Bearer ${token}`)
    .send({
        titreId: listenedTrackId,
        dureeEcoutee: 150,
    });
});

afterAll(async () => {
    await dataSource.query(
        'DELETE FROM utilisateur WHERE email = ?',
        [email],
    );

    await dataSource.query(
        'DELETE FROM genre WHERE nom = ?',
        [genreNom],
    );

    await app.close();
});

it('GET /suggestions/mine — vide avant toute génération', async () => {
    const res = await request(app.getHttpServer())
        .get('/suggestions/mine')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

    expect(res.body).toEqual([]);
});

it('POST /suggestions/mine/generate — suggère le candidat du même genre, pas le titre déjà écouté', async () => {
    const res = await request(app.getHttpServer())
        .post('/suggestions/mine/generate')
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

    // TrackResponseDto expose maintenant l'identifiant sous "id"
    // et non plus sous "titreId".
    const ids = res.body.map((s: any) => s.id);

    expect(ids).toContain(candidateTrackId);
    expect(ids).not.toContain(listenedTrackId);
});

it('GET /suggestions/mine — reflète la dernière génération persistée', async () => {
    const res = await request(app.getHttpServer())
        .get('/suggestions/mine')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

    expect(
        res.body.some((s: any) => s.id === candidateTrackId),
    ).toBe(true);
});
});
