import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

// L'indexation MeiliSearch est asynchrone côté serveur (la requête HTTP de
// modération répond avant que le document soit réellement cherchable) —
// on interroge en boucle plutôt qu'un délai fixe fragile.
async function attendreApparitionDansRecherche(app: INestApplication, query: string, trackId: string, tentatives = 10): Promise<boolean> {
    for (let i = 0; i < tentatives; i++) {
        const res = await request(app.getHttpServer()).get(`/search?q=${query}`);
        if (res.body.tracks.some((t: any) => t.id === trackId)) return true;
        await new Promise((resolve) => setTimeout(resolve, 300));
    }
    return false;
}

describe('Search (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    const uniqueSuffix = Date.now();
    const email = `e2e-search-${uniqueSuffix}@example.com`;
    const pseudo = `e2e_search_${uniqueSuffix}`;
    const genreNom = `TestGenreSearch${uniqueSuffix}`;
    const titreUnique = `ZebraphoneUltraRare${uniqueSuffix}`;

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
            .send({ titre: titreUnique, genreId: resGenre.body.id, duree: 200, fichierAudioUrl: 'https://x.com/a.mp3' });
        trackId = resTrack.body.id;
    });

    afterAll(async () => {
        // Nettoyage explicite de l'index — voir la note en tête de réponse sur
        // le partage de l'instance MeiliSearch entre dev et tests.
        await request(app.getHttpServer()).delete(`/tracks/${trackId}`).set('Authorization', `Bearer ${token}`);
        await dataSource.query('DELETE FROM utilisateur WHERE email = ?', [email]);
        await dataSource.query('DELETE FROM genre WHERE nom = ?', [genreNom]);
        await app.close();
    });

    it("GET /search — un titre EN_ATTENTE n'apparaît pas dans les résultats", async () => {
        const res = await request(app.getHttpServer()).get(`/search?q=${titreUnique}`).expect(200);
        expect(res.body.tracks).toEqual([]);
    });

    it('GET /search — un titre validé finit par apparaître (indexation async)', async () => {
        await request(app.getHttpServer()).patch(`/tracks/${trackId}/moderer`)
            .set('Authorization', `Bearer ${token}`).send({ statut: 'VALIDE' }).expect(200);

        const trouve = await attendreApparitionDansRecherche(app, titreUnique, trackId);
        expect(trouve).toBe(true);
    });

    it('GET /search — le rejet retire le titre de la recherche', async () => {
        await request(app.getHttpServer()).patch(`/tracks/${trackId}/moderer`)
            .set('Authorization', `Bearer ${token}`).send({ statut: 'REJETE' });

        let disparu = false;
        for (let i = 0; i < 10; i++) {
            const res = await request(app.getHttpServer()).get(`/search?q=${titreUnique}`);
            if (!res.body.tracks.some((t: any) => t.id === trackId)) { disparu = true; break; }
            await new Promise((resolve) => setTimeout(resolve, 300));
        }
        expect(disparu).toBe(true);
    });

    it('GET /search — refuse une requête sans q', async () => {
        await request(app.getHttpServer()).get('/search').expect(400);
    });
});