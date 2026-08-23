import { ValidationError } from '../../../core/errors';

export interface HistoriqueEcouteProps {
    id: string;
    utilisateurId: string;
    titreId: string;
    dateEcoute: Date;
    dureeEcoutee: number; // en secondes
}

export class HistoriqueEcoute {
    readonly id: string;
    readonly utilisateurId: string;
    readonly titreId: string;
    readonly dateEcoute: Date;
    readonly dureeEcoutee: number;

    private constructor(props: HistoriqueEcouteProps) {
        this.id = props.id;
        this.utilisateurId = props.utilisateurId;
        this.titreId = props.titreId;
        this.dateEcoute = props.dateEcoute;
        this.dureeEcoutee = props.dureeEcoutee;
    }

    /**
     * Création d'un NOUVEL enregistrement — dureeTitreSecondes est fourni par
     * l'appelant (le service, qui a accès à catalog-tracks), le domaine ne va
     * jamais chercher cette donnée lui-même. Voir explication complète en tête
     * de réponse sur la distinction avec reconstruct().
     */
    static create(props: HistoriqueEcouteProps, dureeTitreSecondes: number): HistoriqueEcoute {
        if (props.dureeEcoutee < 0) {
            throw new ValidationError('La durée écoutée ne peut pas être négative.');
        }
        if (props.dureeEcoutee > dureeTitreSecondes) {
            throw new ValidationError('La durée écoutée ne peut pas dépasser la durée du titre.');
        }
        return new HistoriqueEcoute(props);
    }

    /** Reconstruction depuis la base — ne revalide PAS la durée, voir la note en tête de réponse. */
    static reconstruct(props: HistoriqueEcouteProps): HistoriqueEcoute {
        return new HistoriqueEcoute(props);
    }
}