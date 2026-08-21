import { AlbumsService } from './albums.service';
import { Album } from '../domain/album.entity';
import { AlbumNotFoundError } from '../domain/errors';
import { ArtisteNotFoundError } from '../../catalog-artists';
import { ForbiddenError } from '../../../core/errors';
import type { AlbumRepository } from '../domain/album.repository';
import type { ArtisteRepository } from '../../catalog-artists';

describe('AlbumsService', () => {
    let albumRepository: jest.Mocked<AlbumRepository>;
    let artisteRepository: jest.Mocked<ArtisteRepository>;
    let service: AlbumsService;

    beforeEach(() => {
        albumRepository = { findById: jest.fn(), existsById: jest.fn(), findAll: jest.fn(), findByArtisteId: jest.fn(), save: jest.fn(), delete: jest.fn() };
        artisteRepository = { findById: jest.fn(), existsById: jest.fn(), findAll: jest.fn(), save: jest.fn() };
        service = new AlbumsService(albumRepository, artisteRepository);
    });

    it('refuse de créer un album pour un artiste inexistant', async () => {
        artisteRepository.existsById.mockResolvedValue(false);
        await expect(service.create('inconnu', 'Titre', '2026-01-01')).rejects.toThrow(ArtisteNotFoundError);
    });

    it('crée un album si l\'artiste existe', async () => {
        artisteRepository.existsById.mockResolvedValue(true);
        albumRepository.save.mockImplementation(async (a) => a);
        const album = await service.create('a1', 'Neon Static', '2026-03-14');
        expect(album.artisteId).toBe('a1');
    });

    it('getById() lève 404 si absent', async () => {
        albumRepository.findById.mockResolvedValue(null);
        await expect(service.getById('inconnu')).rejects.toThrow(AlbumNotFoundError);
    });

    it("refuse la modification par un artiste qui n'est pas propriétaire", async () => {
        const album = Album.create({ id: 'al1', artisteId: 'a1', titre: 'T', pochetteUrl: null, dateSortie: '2026-01-01' });
        albumRepository.findById.mockResolvedValue(album);
        await expect(service.update('al1', 'a2', 'Nouveau titre')).rejects.toThrow(ForbiddenError);
    });

    it('autorise la modification par le propriétaire', async () => {
        const album = Album.create({ id: 'al1', artisteId: 'a1', titre: 'T', pochetteUrl: null, dateSortie: '2026-01-01' });
        albumRepository.findById.mockResolvedValue(album);
        albumRepository.save.mockImplementation(async (a) => a);
        const updated = await service.update('al1', 'a1', 'Nouveau titre');
        expect(updated.titre).toBe('Nouveau titre');
    });
});