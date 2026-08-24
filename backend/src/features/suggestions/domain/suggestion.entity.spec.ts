import { Suggestion } from './suggestion.entity';
import { ValidationError } from '../../../core/errors';

describe('Suggestion', () => {
    const baseProps = { id: 's1', utilisateurId: 'u1', titreId: 't1', score: 0.5, dateGeneration: new Date() };

    it('rejette un score négatif', () => {
        expect(() => Suggestion.create({ ...baseProps, score: -0.1 })).toThrow(ValidationError);
    });
    it('rejette un score supérieur à 1', () => {
        expect(() => Suggestion.create({ ...baseProps, score: 1.5 })).toThrow(ValidationError);
    });
    it('accepte les bornes 0 et 1', () => {
        expect(() => Suggestion.create({ ...baseProps, score: 0 })).not.toThrow();
        expect(() => Suggestion.create({ ...baseProps, score: 1 })).not.toThrow();
    });
});