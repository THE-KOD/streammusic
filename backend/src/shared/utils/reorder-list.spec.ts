import { reorderList } from './reorder-list';

describe('reorderList', () => {
    const entries = [
        { id: 't1', ordre: 1 },
        { id: 't2', ordre: 2 },
        { id: 't3', ordre: 3 },
    ];

    it('déplace un élément vers le début', () => {
        const result = reorderList(entries, 't3', 0);
        expect(result.map((e) => e.id)).toEqual(['t3', 't1', 't2']);
    });

    it('déplace un élément vers la fin', () => {
        const result = reorderList(entries, 't1', 2);
        expect(result.map((e) => e.id)).toEqual(['t2', 't3', 't1']);
    });

    it('renumérote toujours à partir de 1, sans trou', () => {
        const result = reorderList(entries, 't2', 0);
        expect(result.map((e) => e.ordre)).toEqual([1, 2, 3]);
    });

    it('une position hors limites est ramenée dans les bornes valides', () => {
        const result = reorderList(entries, 't1', 99);
        expect(result.map((e) => e.id)).toEqual(['t2', 't3', 't1']);
    });

    it("lève une erreur si l'élément n'appartient pas à la liste", () => {
        expect(() => reorderList(entries, 'inconnu', 0)).toThrow();
    });
});