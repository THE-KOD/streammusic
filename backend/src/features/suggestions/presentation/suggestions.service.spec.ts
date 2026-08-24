import { SuggestionsService } from './suggestions.service';
import { Track } from '../../catalog-tracks';
import { HistoriqueEcoute } from '../../listening-history';
import type { SuggestionRepository } from '../domain/suggestion.repository';
import type { TrackRepository } from '../../catalog-tracks';
import type { HistoriqueRepository } from '../../listening-history';

function buildTrack(id: string, genreId: string, nombreEcoutes = 0) {
    return Track.create({
        id, albumId: null, artisteId: 'a1', genreId, titre: `T-${id}`, duree: 200,
        fichierAudioUrl: 'https://x.com/a.mp3', pochetteUrl: null, dateSortie: null,
        nombreEcoutes, dateAjout: new Date(), statutModeration: 'VALIDE', moderateurId: null, dateModeration: null,
    });
}

describe('SuggestionsService', () => {
    let suggestionRepository: jest.Mocked<SuggestionRepository>;
    let trackRepository: jest.Mocked<TrackRepository>;
    let historiqueRepository: jest.Mocked<HistoriqueRepository>;
    let service: SuggestionsService;

    beforeEach(() => {
        suggestionRepository = { listByUtilisateur: jest.fn(), replaceAllForUtilisateur: jest.fn() };
        trackRepository = { findById: jest.fn(), findAllValide: jest.fn(), findAllByArtiste: jest.fn(), save: jest.fn(), delete: jest.fn() };
        historiqueRepository = { save: jest.fn(), listByUtilisateur: jest.fn(), clearForUtilisateur: jest.fn() };
        service = new SuggestionsService(suggestionRepository, trackRepository, historiqueRepository);
    });

    it("se rabat sur la popularité si l'historique est vide", async () => {
        historiqueRepository.listByUtilisateur.mockResolvedValue([]);
        trackRepository.findAllValide.mockResolvedValue([buildTrack('t1', 'g1', 50), buildTrack('t2', 'g1', 10)]);
        suggestionRepository.replaceAllForUtilisateur.mockResolvedValue();

        const result = await service.regenerate('u1');
        expect(result[0].track.id).toBe('t1');
        expect(result.every((r) => r.score === 0.1)).toBe(true);
    });

    it("priorise le genre le plus présent dans l'historique récent", async () => {
        const historique = [
            HistoriqueEcoute.reconstruct({ id: 'h1', utilisateurId: 'u1', titreId: 't-ecoute-1', dateEcoute: new Date(), dureeEcoutee: 100 }),
            HistoriqueEcoute.reconstruct({ id: 'h2', utilisateurId: 'u1', titreId: 't-ecoute-2', dateEcoute: new Date(), dureeEcoutee: 100 }),
        ];
        historiqueRepository.listByUtilisateur.mockResolvedValue(historique);
        trackRepository.findById.mockImplementation(async (id) => (id.startsWith('t-ecoute') ? buildTrack(id, 'rock') : null));
        trackRepository.findAllValide.mockImplementation(async (filters) =>
            filters?.genreId === 'rock' ? [buildTrack('t-suggere', 'rock')] : [],
        );
        suggestionRepository.replaceAllForUtilisateur.mockResolvedValue();

        const result = await service.regenerate('u1');
        expect(result).toHaveLength(1);
        expect(result[0].track.id).toBe('t-suggere');
        expect(result[0].score).toBe(1);
    });

    it("exclut les titres déjà présents dans l'historique", async () => {
        const historique = [HistoriqueEcoute.reconstruct({ id: 'h1', utilisateurId: 'u1', titreId: 't-deja-ecoute', dateEcoute: new Date(), dureeEcoutee: 100 })];
        historiqueRepository.listByUtilisateur.mockResolvedValue(historique);
        trackRepository.findById.mockResolvedValue(buildTrack('t-deja-ecoute', 'g1'));
        trackRepository.findAllValide.mockResolvedValue([buildTrack('t-deja-ecoute', 'g1'), buildTrack('t-nouveau', 'g1')]);
        suggestionRepository.replaceAllForUtilisateur.mockResolvedValue();

        const result = await service.regenerate('u1');
        expect(result.map((r) => r.track.id)).not.toContain('t-deja-ecoute');
        expect(result.map((r) => r.track.id)).toContain('t-nouveau');
    });
});