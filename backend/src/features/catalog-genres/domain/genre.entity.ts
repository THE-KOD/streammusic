import { ValidationError } from '../../../core/errors';

// Les données brutes nécessaires pour construire un Genre — utilisées
// à la fois par le mapper (venant de la base) et par le service (venant d'un DTO).
export interface GenreProps {
    id: string;
    nom: string;
}

export class Genre {
    readonly id: string;
    nom: string;

    // Constructeur privé : on force à passer par create() pour garantir
    // qu'un Genre ne peut jamais exister dans un état invalide (nom vide).
    private constructor(props: GenreProps) {
        this.id = props.id;
        this.nom = props.nom;
    }

    static create(props: GenreProps): Genre {
        const nomNettoye = props.nom?.trim() ?? '';
        if (nomNettoye.length === 0) {
            throw new ValidationError('Le nom du genre ne peut pas être vide.');
        }
        return new Genre({ ...props, nom: nomNettoye });
    }

    // Méthode métier plutôt qu'un simple setter public : on repasse
    // par la même validation qu'à la création, pas de contournement possible.
    renommer(nouveauNom: string): void {
        const nomNettoye = nouveauNom?.trim() ?? '';
        if (nomNettoye.length === 0) {
            throw new ValidationError('Le nom du genre ne peut pas être vide.');
        }
        this.nom = nomNettoye;
    }
}