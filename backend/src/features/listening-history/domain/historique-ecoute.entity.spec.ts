import { HistoriqueEcoute } from './historique-ecoute.entity';
import { ValidationError } from '../../../core/errors';

describe('HistoriqueEcoute', () => {
    const baseProps = { id: 'h1', utilisateurId: 'u1', titreId: 't1', dateEcoute: new Date(), dureeEcoutee: 100 };

    it('rejette une durée négative', () => {
        expect(() => HistoriqueEcoute.create({ ...baseProps, dureeEcoutee: -1 }, 200)).toThrow(ValidationError);
    });

    it('rejette une durée écoutée supérieure à la durée du titre', () => {
        expect(() => HistoriqueEcoute.create({ ...baseProps, dureeEcoutee: 250 }, 200)).toThrow(ValidationError);
    });

    it('accepte une durée écoutée égale à la durée du titre', () => {
        expect(() => HistoriqueEcoute.create({ ...baseProps, dureeEcoutee: 200 }, 200)).not.toThrow();
    });

    it("reconstruct() ne revalide pas la durée (chargement depuis la base)", () => {
        // Simule un historique dont le titre associé a depuis changé de durée
        expect(() => HistoriqueEcoute.reconstruct({ ...baseProps, dureeEcoutee: 999 })).not.toThrow();
    });
});