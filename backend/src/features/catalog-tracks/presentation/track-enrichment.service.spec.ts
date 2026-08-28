import { TrackEnrichmentService } from './track-enrichment.service';
import { Track } from '../domain/track.entity';
import { Utilisateur } from '../../users';
import { Album } from '../../catalog-albums';
import type { UtilisateurRepository } from '../../users';
import type { AlbumRepository } from '../../catalog-albums';

function buildTrack(id: string, artisteId: string, albumId: string | null) {
    return Track.create({
        id, albumId, artisteId, genreId: 'g1', titre: `T-${id}`, duree: 200,
        fichierAudioUrl: 'https://x.com/a.mp3', pochetteUrl: null, dateSortie: null,
        nombreEcoutes: 0, dateAjout: new Date(), statutModeration: 'VALIDE', moderateurId: null, dateModeration: null,
    });
}
function buildUser(id: string, pseudo: string) {
    return Utilisateur.create({
        id, pseudo, email: `${pseudo}@x.com`, motDePasseHash: 'h', oauthProvider: null, oauthId: null,
        photoProfilUrl: null, statutCompte: 'ACTIF', dateInscription: new Date(),
    });
}

describe('TrackEnrichmentService', () => {
    let utilisateurRepository: jest.Mocked<UtilisateurRepository>;
    let albumRepository: jest.Mocked<AlbumRepository>;
    let service: TrackEnrichmentService;

    beforeEach(() => {
        utilisateurRepository = { findById: jest.fn(), findByEmail: jest.fn(), findByPseudo: jest.fn(), findAll: jest.fn(), countAll: jest.fn(), save: jest.fn(), delete: jest.fn() };
        albumRepository = { findById: jest.fn(), existsById: jest.fn(), findAll: jest.fn(), findByArtisteId: jest.fn(), save: jest.fn(), delete: jest.fn() };
        service = new TrackEnrichmentService(utilisateurRepository, albumRepository);
    });

    it('resout artisteNom et albumTitre pour un titre avec album', async () => {
        utilisateurRepository.findById.mockResolvedValue(buildUser('a1', 'Nova Kline'));
        albumRepository.findById.mockResolvedValue(Album.create({ id: 'al1', artisteId: 'a1', titre: 'Neon Static', pochetteUrl: null, dateSortie: '2026-01-01' }));

        const dto = await service.enrichOne(buildTrack('t1', 'a1', 'al1'));
        expect(dto.artisteNom).toBe('Nova Kline');
        expect(dto.albumTitre).toBe('Neon Static');
    });

    it('laisse albumTitre indéfini pour un single', async () => {
        utilisateurRepository.findById.mockResolvedValue(buildUser('a1', 'Nova Kline'));
        const dto = await service.enrichOne(buildTrack('t1', 'a1', null));
        expect(dto.albumTitre).toBeUndefined();
        expect(albumRepository.findById).not.toHaveBeenCalled();
    });

    it("enrichMany() ne resout chaque artiste qu'une seule fois meme si plusieurs titres le partagent", async () => {
        utilisateurRepository.findById.mockResolvedValue(buildUser('a1', 'Nova Kline'));
        await service.enrichMany([buildTrack('t1', 'a1', null), buildTrack('t2', 'a1', null)]);
        expect(utilisateurRepository.findById).toHaveBeenCalledTimes(1);
    });
});