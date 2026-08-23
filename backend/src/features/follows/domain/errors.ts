import { ValidationError } from '../../../core/errors';

// Règle métier qui n'existe pas explicitement dans le schéma SQL (aucune
// contrainte ne l'empêcherait) mais qui a du sens : se suivre soi-même
// n'a aucune utilité et pourrait fausser un futur calcul de popularité.
export class NeSuitPasSoiMemeError extends ValidationError {
    constructor() {
        super('Un artiste ne peut pas se suivre lui-même.');
    }
}