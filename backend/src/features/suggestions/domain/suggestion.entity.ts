import { ValidationError } from '../../../core/errors';

export interface SuggestionProps {
    id: string;
    utilisateurId: string;
    titreId: string;
    score: number; // 0 à 1, voir chk_score du schéma
    dateGeneration: Date;
}

export class Suggestion {
    readonly id: string;
    readonly utilisateurId: string;
    readonly titreId: string;
    readonly score: number;
    readonly dateGeneration: Date;

    private constructor(props: SuggestionProps) {
        this.id = props.id;
        this.utilisateurId = props.utilisateurId;
        this.titreId = props.titreId;
        this.score = props.score;
        this.dateGeneration = props.dateGeneration;
    }

    static create(props: SuggestionProps): Suggestion {
        if (props.score < 0 || props.score > 1) {
            throw new ValidationError('Le score doit être compris entre 0 et 1.');
        }
        return new Suggestion(props);
    }
}