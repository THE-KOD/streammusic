import { SearchService } from './search.service';
import { Album } from '../../catalog-albums';
import { Artiste } from '../../catalog-artists';
import { Utilisateur } from '../../users';
import type { TrackSearchRepository } from '../domain/track-search.repository';
import type { ArtisteRepository } from '../../catalog-artists';
import type { UtilisateurRepository } from '../../users';
import type { AlbumRepository } from '../../catalog-albums';

function buildUtilisateur(id: string, pseudo: string) {
    return Utilisateur.create({
        id, pseudo, email: `${pseudo}@example.com`, motDePasseHash: 'hash', oauthProvider: null, oauthId: null,
        photoProfilUrl: null, statutCompte: 'ACTIF', dateInscription: new Date(),
    });
}

describe('SearchService', () => {
    let trackSearchRepository: jest.Mocked<TrackSearchRepository>;
    let artisteRepository: jest.Mocked<ArtisteRepository>;
    let utilisateurRepository: jest.Mocked<UtilisateurRepository>;
    let albumRepository: jest.Mocked<AlbumRepository>;
    let service: SearchService;

    beforeEach(() => {
        trackSearchRepository = { indexTrack: jest.fn(), removeTrack: jest.fn(), search: jest.fn() };
        artisteRepository = { findById: jest.fn(), existsById: jest.fn(), findAll: jest.fn(), save: jest.fn() };
        utilisateurRepository = { findById: jest.fn(), findByEmail: jest.fn(), findByPseudo: jest.fn(), save: jest.fn(), delete: jest.fn() };
        albumRepository = { findById: jest.fn(), existsById: jest.fn(), findAll: jest.fn(), findByArtisteId: jest.fn(), save: jest.fn(), delete: jest.fn() };
        service = new SearchService(trackSearchRepository, artisteRepository, utilisateurRepository, albumRepository);
    });

    it('filtre les artistes par sous-chaîne insensible à la casse', async () => {
        artisteRepository.findAll.mockResolvedValue([Artiste.create({ id: 'a1', biographie: null, photoArtisteUrl: null })]);
        utilisateurRepository.findById.mockResolvedValue(buildUtilisateur('a1', 'Nova Kline'));
        trackSearchRepository.search.mockResolvedValue([]);
        albumRepository.findAll.mockResolvedValue([]);

        const result = await service.search('nova', {});
        expect(result.artists).toEqual([{ id: 'a1', pseudo: 'Nova Kline' }]);
    });

    it('filtre les albums par sous-chaîne dans le titre', async () => {
        artisteRepository.findAll.mockResolvedValue([]);
        trackSearchRepository.search.mockResolvedValue([]);
        albumRepository.findAll.mockResolvedValue([
            Album.create({ id: 'al1', artisteId: 'a1', titre: 'Neon Static', pochetteUrl: null, dateSortie: '2026-01-01' }),
            Album.create({ id: 'al2', artisteId: 'a1', titre: 'Low Tide', pochetteUrl: null, dateSortie: '2026-01-01' }),
        ]);

        const result = await service.search('neon', {});
        expect(result.albums.map((a) => a.album.id)).toEqual(['al1']);
    });

    it('délègue la recherche de titres au repository MeiliSearch avec les filtres fournis', async () => {
        artisteRepository.findAll.mockResolvedValue([]);
        albumRepository.findAll.mockResolvedValue([]);
        trackSearchRepository.search.mockResolvedValue([]);

        await service.search('midnight', { genreId: 'g1', dureeMin: 100 });
        expect(trackSearchRepository.search).toHaveBeenCalledWith('midnight', { genreId: 'g1', dureeMin: 100 });
    });
});