import { Album } from './album.entity';
import { ValidationError } from '../../../core/errors';

describe('Album', () => {
    const baseProps = { id: 'al1', artisteId: 'a1', titre: 'Neon Static', pochetteUrl: null, dateSortie: '2026-03-14' };

    it('rejette un titre vide', () => {
        expect(() => Album.create({ ...baseProps, titre: '' })).toThrow(ValidationError);
    });

    it('nettoie les espaces autour du titre', () => {
        const album = Album.create({ ...baseProps, titre: '  Neon Static  ' });
        expect(album.titre).toBe('Neon Static');
    });

    it('renommer() applique la même validation que create()', () => {
        const album = Album.create(baseProps);
        album.renommer('Neon Static (Deluxe)');
        expect(album.titre).toBe('Neon Static (Deluxe)');
        expect(() => album.renommer('')).toThrow(ValidationError);
    });

    it('modifierPochette() accepte null pour retirer la pochette', () => {
        const album = Album.create({ ...baseProps, pochetteUrl: 'http://old.jpg' });
        album.modifierPochette(null);
        expect(album.pochetteUrl).toBeNull();
    });
});