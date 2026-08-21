import { Track } from './track.entity';
import { ValidationError } from '../../../core/errors';

function buildProps(overrides: Partial<Parameters<typeof Track.create>[0]> = {}) {
    return {
        id: 't1', albumId: null, artisteId: 'a1', genreId: 'g1', titre: 'Midnight Drive',
        duree: 222, fichierAudioUrl: 'https://x.com/a.mp3', pochetteUrl: null, dateSortie: null,
        nombreEcoutes: 0, dateAjout: new Date(), statutModeration: 'EN_ATTENTE' as const,
        moderateurId: null, dateModeration: null,
        ...overrides,
    };
}

describe('Track', () => {
    it('rejette une durée nulle ou négative', () => {
        expect(() => Track.create(buildProps({ duree: 0 }))).toThrow(ValidationError);
        expect(() => Track.create(buildProps({ duree: -5 }))).toThrow(ValidationError);
    });

    it('rejette un titre vide', () => {
        expect(() => Track.create(buildProps({ titre: '  ' }))).toThrow(ValidationError);
    });

    it('estVisiblePubliquement uniquement si VALIDE', () => {
        const enAttente = Track.create(buildProps());
        expect(enAttente.estVisiblePubliquement).toBe(false);

        const valide = Track.create(buildProps({ statutModeration: 'VALIDE' }));
        expect(valide.estVisiblePubliquement).toBe(true);
    });

    it('modifierMetadonnees() repasse un titre VALIDE en EN_ATTENTE', () => {
        const track = Track.create(buildProps({ statutModeration: 'VALIDE', dateModeration: new Date() }));
        track.modifierMetadonnees({ titre: 'Nouveau titre' });
        expect(track.statutModeration).toBe('EN_ATTENTE');
        expect(track.dateModeration).toBeNull();
    });

    it('modifierMetadonnees() ne touche pas au statut si déjà EN_ATTENTE', () => {
        const track = Track.create(buildProps({ statutModeration: 'EN_ATTENTE' }));
        track.modifierMetadonnees({ titre: 'Nouveau titre' });
        expect(track.statutModeration).toBe('EN_ATTENTE');
    });

    it('valider() et rejeter() mettent à jour statut et dateModeration', () => {
        const track = Track.create(buildProps());
        track.valider();
        expect(track.statutModeration).toBe('VALIDE');
        expect(track.dateModeration).not.toBeNull();

        track.rejeter();
        expect(track.statutModeration).toBe('REJETE');
    });

    it('incrementerEcoutes() augmente le compteur de 1', () => {
        const track = Track.create(buildProps({ nombreEcoutes: 5 }));
        track.incrementerEcoutes();
        expect(track.nombreEcoutes).toBe(6);
    });
});