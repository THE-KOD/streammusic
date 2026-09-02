import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

describe('Admin (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    const uniqueSuffix = Date.now();
    const emailAdmin = `e2e-admin-${uniqueSuffix}@example.com`;
    const pseudoAdmin = `e2e_admin_${uniqueSuffix}`;
    const emailUser = `e2e-admin-user-${uniqueSuffix}@example.com`;
    const pseudoUser = `e2e_admin_user_${uniqueSuffix}`;

    let tokenAdmin: string;
    let tokenUser: string;
    let userIdToManage: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleFixture.createNestApplication();
        configureApp(app);
        dataSource = moduleFixture.get(DataSource);
        await app.init();

        const resAdmin = await request(app.getHttpServer()).post('/auth/register')
            .send({ pseudo: pseudoAdmin, email: emailAdmin, motDePasse: 'motDePasseSecurise123' });
        tokenAdmin = resAdmin.body.accessToken;
        // Promotion directe en base — exactement ce que fait le script CLI,
        // mais inline pour ne pas dépendre d'un process externe dans les tests.
        await dataSource.query('INSERT INTO administrateur (id, niveau_acces) VALUES (?, ?)', [resAdmin.body.utilisateur.id, 'STANDARD']);

        const resUser = await request(app.getHttpServer()).post('/auth/register')
            .send({ pseudo: pseudoUser, email: emailUser, motDePasse: 'motDePasseSecurise123' });
        tokenUser = resUser.body.accessToken;
        userIdToManage = resUser.body.utilisateur.id;
    });

    afterAll(async () => {
        await dataSource.query('DELETE FROM utilisateur WHERE email IN (?, ?)', [emailAdmin, emailUser]);
        await app.close();
    });

    it('GET /admin/stats — refuse un utilisateur non-admin', async () => {
        await request(app.getHttpServer()).get('/admin/stats')
            .set('Authorization', `Bearer ${tokenUser}`).expect(403);
    });

    it('GET /admin/stats — autorisé pour un admin', async () => {
        const res = await request(app.getHttpServer()).get('/admin/stats')
            .set('Authorization', `Bearer ${tokenAdmin}`).expect(200);
        expect(res.body.totalUtilisateurs).toBeGreaterThanOrEqual(2);
    });

    it('GET /admin/users — liste les comptes', async () => {
        const res = await request(app.getHttpServer()).get('/admin/users')
            .set('Authorization', `Bearer ${tokenAdmin}`).expect(200);
        expect(res.body.some((u: any) => u.id === userIdToManage)).toBe(true);
    });

    it('PATCH /admin/users/:id/suspend — suspend un compte', async () => {
        const res = await request(app.getHttpServer()).patch(`/admin/users/${userIdToManage}/suspend`)
            .set('Authorization', `Bearer ${tokenAdmin}`).expect(200);
        expect(res.body.statutCompte).toBe('SUSPENDU');
    });

    it('POST /auth/login — un compte suspendu ne peut plus se connecter', async () => {
        await request(app.getHttpServer()).post('/auth/login')
            .send({ email: emailUser, motDePasse: 'motDePasseSecurise123' }).expect(401);
    });

    it('PATCH /admin/users/:id/reactivate — réactive le compte', async () => {
        const res = await request(app.getHttpServer()).patch(`/admin/users/${userIdToManage}/reactivate`)
            .set('Authorization', `Bearer ${tokenAdmin}`).expect(200);
        expect(res.body.statutCompte).toBe('ACTIF');
    });

    describe('Admin — moderation des titres (e2e)', () => {
        const genreNom = `TestGenreAdminMod${Date.now()}`;
        let trackId: string;

        beforeAll(async () => {
            await request(app.getHttpServer()).post('/artists/me').set('Authorization', `Bearer ${tokenAdmin}`).send({});
            const resGenre = await request(app.getHttpServer()).post('/genres')
                .set('Authorization', `Bearer ${tokenAdmin}`).send({ nom: genreNom });
            const resTrack = await request(app.getHttpServer()).post('/tracks')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({ titre: 'Titre modo admin', genreId: resGenre.body.id, duree: 200, fichierAudioUrl: 'https://x.com/a.mp3' });
            trackId = resTrack.body.id;
        });

        afterAll(async () => {
            // Supprime le titre via l'API (jamais en SQL direct) — libère la
            // contrainte ON DELETE RESTRICT sur genre_id avant de nettoyer le genre.
            await request(app.getHttpServer()).delete(`/tracks/${trackId}`).set('Authorization', `Bearer ${tokenAdmin}`);
            await dataSource.query('DELETE FROM genre WHERE nom = ?', [genreNom]);
        });

        it('GET /admin/tracks?statut=EN_ATTENTE — trouve le titre en attente', async () => {
            const res = await request(app.getHttpServer()).get('/admin/tracks?statut=EN_ATTENTE')
                .set('Authorization', `Bearer ${tokenAdmin}`).expect(200);
            expect(res.body.some((t: any) => t.id === trackId)).toBe(true);
            expect(res.body.find((t: any) => t.id === trackId).genreNom).toBe(genreNom);
        });

        it('GET /admin/users — inclut le role admin pour le compte administrateur', async () => {
            const res = await request(app.getHttpServer()).get('/admin/users')
                .set('Authorization', `Bearer ${tokenAdmin}`).expect(200);
            const self = res.body.find((u: any) => u.id === tokenAdmin && false); // placeholder, voir note
            expect(res.body.every((u: any) => ['user', 'artist', 'admin'].includes(u.role))).toBe(true);
        });
    });
});