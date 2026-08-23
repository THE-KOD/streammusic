import { reorderTracks } from './reorder-tracks';

describe('reorderTracks', () => {
    const entries = [
        { titreId: 't1', ordre: 1 },
        { titreId: 't2', ordre: 2 },
        { titreId: 't3', ordre: 3 },
    ];

    it('déplace un titre vers le début', () => {
        const result = reorderTracks(entries, 't3', 0);
        expect(result.map((e) => e.titreId)).toEqual(['t3', 't1', 't2']);
    });

    it('déplace un titre vers la fin', () => {
        const result = reorderTracks(entries, 't1', 2);
        expect(result.map((e) => e.titreId)).toEqual(['t2', 't3', 't1']);
    });

    it('renumérote toujours à partir de 1, sans trou', () => {
        const result = reorderTracks(entries, 't2', 0);
        expect(result.map((e) => e.ordre)).toEqual([1, 2, 3]);
    });

    it('une position hors limites est ramenée dans les bornes valides', () => {
        const result = reorderTracks(entries, 't1', 99);
        expect(result.map((e) => e.titreId)).toEqual(['t2', 't3', 't1']);
    });
});