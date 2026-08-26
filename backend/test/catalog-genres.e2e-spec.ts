import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

describe('Catalog Genres (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    const uniqueSuffix = Date.now();
    const testEmail = `e2e-genres-${uniqueSuffix}@example.com`;
    const testPseudo = `e2e_genres_${uniqueSuffix}`;
    const genreNom = `TestGenre${uniqueSuffix}`;

    let accessToken: string;
    let genreId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        configureApp(app);
        dataSource = moduleFixture.get(DataSource);
        await app.init();

        // Création du compte de test
        const registerRes = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                pseudo: testPseudo,
                email: testEmail,
                motDePasse: 'motDePasseSecurise123',
            });

        accessToken = registerRes.body.accessToken;

        // Promotion du même utilisateur en administrateur
        const userId = registerRes.body.utilisateur.id;

        await dataSource.query(
            'INSERT INTO administrateur (id, niveau_acces) VALUES (?, ?)',
            [userId, 'STANDARD'],
        );
    });

    afterAll(async () => {
        // Nettoyage dans l'ordre : le genre d'abord
        await dataSource.query(
            'DELETE FROM genre WHERE nom = ?',
            [genreNom],
        );

        // Suppression du rôle administrateur avant la suppression de l'utilisateur
        await dataSource.query(
            'DELETE FROM administrateur WHERE id = (SELECT id FROM utilisateur WHERE email = ?)',
            [testEmail],
        );

        // Suppression du compte utilisateur
        await dataSource.query(
            'DELETE FROM utilisateur WHERE email = ?',
            [testEmail],
        );

        await app.close();
    });

    it('GET /genres — accessible sans authentification', async () => {
        await request(app.getHttpServer())
            .get('/genres')
            .expect(200);
    });

    it('POST /genres — refuse sans authentification', async () => {
        await request(app.getHttpServer())
            .post('/genres')
            .send({ nom: genreNom })
            .expect(401);
    });

    it('POST /genres — crée un genre', async () => {
        const res = await request(app.getHttpServer())
            .post('/genres')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ nom: genreNom })
            .expect(201);

        genreId = res.body.id;
        expect(res.body.nom).toBe(genreNom);
    });

    it('POST /genres — refuse un doublon', async () => {
        const res = await request(app.getHttpServer())
            .post('/genres')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ nom: genreNom })
            .expect(409);

        expect(res.body.error.code).toBe('CONFLICT');
    });

    it('GET /genres/:id — consulte le genre créé', async () => {
        const res = await request(app.getHttpServer())
            .get(`/genres/${genreId}`)
            .expect(200);

        expect(res.body.nom).toBe(genreNom);
    });

    it('PATCH /genres/:id — renomme le genre', async () => {
        const nouveauNom = `${genreNom}_v2`;

        const res = await request(app.getHttpServer())
            .patch(`/genres/${genreId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ nom: nouveauNom })
            .expect(200);

        expect(res.body.nom).toBe(nouveauNom);
    });

    it('DELETE /genres/:id — supprime un genre non utilisé', async () => {
        await request(app.getHttpServer())
            .delete(`/genres/${genreId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(204);
    });

    it('GET /genres/:id — 404 après suppression', async () => {
        await request(app.getHttpServer())
            .get(`/genres/${genreId}`)
            .expect(404);
    });
});
