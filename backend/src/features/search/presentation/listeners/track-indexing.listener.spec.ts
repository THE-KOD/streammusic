import { TrackIndexingListener } from './track-indexing.listener';
import { Track, TrackValidatedEvent, TrackUnpublishedEvent } from '../../../catalog-tracks';
import { Genre } from '../../../catalog-genres';
import { Utilisateur } from '../../../users';
import type { TrackSearchRepository } from '../../domain/track-search.repository';
import type { TrackRepository } from '../../../catalog-tracks';
import type { GenreRepository } from '../../../catalog-genres';
import type { AlbumRepository } from '../../../catalog-albums';
import type { UtilisateurRepository } from '../../../users';

function buildTrack() {
    return Track.create({
        id: 't1', albumId: null, artisteId: 'a1', genreId: 'g1', titre: 'Midnight Drive', duree: 222,
        fichierAudioUrl: 'https://x.com/a.mp3', pochetteUrl: null, dateSortie: '2026-01-01',
        nombreEcoutes: 0, dateAjout: new Date(), statutModeration: 'VALIDE', moderateurId: null, dateModeration: new Date(),
    });
}

describe('TrackIndexingListener', () => {
    let searchRepository: jest.Mocked<TrackSearchRepository>;
    let trackRepository: jest.Mocked<TrackRepository>;
    let genreRepository: jest.Mocked<GenreRepository>;
    let albumRepository: jest.Mocked<AlbumRepository>;
    let utilisateurRepository: jest.Mocked<UtilisateurRepository>;
    let listener: TrackIndexingListener;

    beforeEach(() => {
        searchRepository = { indexTrack: jest.fn(), removeTrack: jest.fn(), search: jest.fn() };
        trackRepository = { findById: jest.fn(), findAllValide: jest.fn(), findAllByArtiste: jest.fn(), save: jest.fn(), delete: jest.fn() };
        genreRepository = { findAll: jest.fn(), findById: jest.fn(), findByNom: jest.fn(), save: jest.fn(), delete: jest.fn() };
        albumRepository = { findById: jest.fn(), existsById: jest.fn(), findAll: jest.fn(), findByArtisteId: jest.fn(), save: jest.fn(), delete: jest.fn() };
        utilisateurRepository = { findById: jest.fn(), findByEmail: jest.fn(), findByPseudo: jest.fn(), save: jest.fn(), delete: jest.fn() };
        listener = new TrackIndexingListener(searchRepository, trackRepository, genreRepository, albumRepository, utilisateurRepository);
    });

    it('indexe le titre avec le pseudo et le nom de genre résolus', async () => {
        trackRepository.findById.mockResolvedValue(buildTrack());
        genreRepository.findById.mockResolvedValue(Genre.create({ id: 'g1', nom: 'Pop' }));
        utilisateurRepository.findById.mockResolvedValue(
            Utilisateur.create({ id: 'a1', pseudo: 'Nova Kline', email: 'n@x.com', motDePasseHash: 'h', oauthProvider: null, oauthId: null, photoProfilUrl: null, statutCompte: 'ACTIF', dateInscription: new Date() }),
        );

        await listener.handleValidated(new TrackValidatedEvent('t1', 'Midnight Drive', 'a1'));

        expect(searchRepository.indexTrack).toHaveBeenCalledWith(expect.objectContaining({ id: 't1', artisteNom: 'Nova Kline', genreNom: 'Pop' }));
    });

    it('avale silencieusement une erreur de désindexation (titre jamais indexé)', async () => {
        searchRepository.removeTrack.mockRejectedValue(new Error('document not found'));
        await expect(listener.handleUnpublished(new TrackUnpublishedEvent('t-jamais-indexe'))).resolves.not.toThrow();
    });
});