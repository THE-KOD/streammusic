import { Genre } from './genre.entity';
import { ValidationError } from '../../../core/errors';

describe('Genre', () => {
    it('rejette un nom vide', () => {
        expect(() => Genre.create({ id: 'g1', nom: '' })).toThrow(ValidationError);
    });

    it('rejette un nom composé uniquement d\'espaces', () => {
        expect(() => Genre.create({ id: 'g1', nom: '   ' })).toThrow(ValidationError);
    });

    it('nettoie les espaces autour du nom (trim)', () => {
        const genre = Genre.create({ id: 'g1', nom: '  Afrobeat  ' });
        expect(genre.nom).toBe('Afrobeat');
    });

    it('renommer() met à jour le nom avec la même validation', () => {
        const genre = Genre.create({ id: 'g1', nom: 'Pop' });
        genre.renommer('Pop Rock');
        expect(genre.nom).toBe('Pop Rock');
        expect(() => genre.renommer('')).toThrow(ValidationError);
    });
});