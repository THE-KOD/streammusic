import { ValidationError } from '../../../core/errors';

export type StatutModeration = 'EN_ATTENTE' | 'VALIDE' | 'REJETE';

export interface TrackProps {
    id: string;
    albumId: string | null; // nullable : un single n'appartient à aucun album
    artisteId: string;
    genreId: string;
    titre: string;
    duree: number; // en secondes, doit être > 0 (contrainte chk_duree du schéma)
    fichierAudioUrl: string;
    pochetteUrl: string | null;
    dateSortie: string | null; // format 'YYYY-MM-DD', voir note catalog-albums sur le choix string
    nombreEcoutes: number;
    dateAjout: Date;
    statutModeration: StatutModeration;
    moderateurId: string | null;
    dateModeration: Date | null;
}

// Regroupe les champs modifiables via modifierMetadonnees() — tous optionnels,
// undefined = "ne pas toucher", contrairement à null qui a un sens propre
// pour albumId/pochetteUrl/dateSortie (= "retirer explicitement la valeur").
export interface MetadonneesModifiables {
    titre?: string;
    genreId?: string;
    albumId?: string | null;
    pochetteUrl?: string | null;
    dateSortie?: string | null;
}

export class Track {
    readonly id: string;
    albumId: string | null;
    readonly artisteId: string;
    genreId: string;
    titre: string;
    readonly duree: number;
    readonly fichierAudioUrl: string;
    pochetteUrl: string | null;
    dateSortie: string | null;
    nombreEcoutes: number;
    readonly dateAjout: Date;
    statutModeration: StatutModeration;
    moderateurId: string | null;
    dateModeration: Date | null;

    private constructor(props: TrackProps) {
        this.id = props.id;
        this.albumId = props.albumId;
        this.artisteId = props.artisteId;
        this.genreId = props.genreId;
        this.titre = props.titre;
        this.duree = props.duree;
        this.fichierAudioUrl = props.fichierAudioUrl;
        this.pochetteUrl = props.pochetteUrl;
        this.dateSortie = props.dateSortie;
        this.nombreEcoutes = props.nombreEcoutes;
        this.dateAjout = props.dateAjout;
        this.statutModeration = props.statutModeration;
        this.moderateurId = props.moderateurId;
        this.dateModeration = props.dateModeration;
    }

    static create(props: TrackProps): Track {
        const titreNettoye = props.titre?.trim() ?? '';
        if (titreNettoye.length === 0) {
            throw new ValidationError('Le titre ne peut pas être vide.');
        }
        // Miroir applicatif de la contrainte chk_duree du schéma SQL — on refuse
        // ici plutôt que de laisser MySQL renvoyer une erreur SQL brute.
        if (props.duree <= 0) {
            throw new ValidationError('La durée doit être supérieure à 0.');
        }
        return new Track({ ...props, titre: titreNettoye });
    }

    get estVisiblePubliquement(): boolean {
        return this.statutModeration === 'VALIDE';
    }

    modifierMetadonnees(params: MetadonneesModifiables): void {
        if (params.titre !== undefined) {
            const titreNettoye = params.titre.trim();
            if (titreNettoye.length === 0) throw new ValidationError('Le titre ne peut pas être vide.');
            this.titre = titreNettoye;
        }
        if (params.genreId !== undefined) this.genreId = params.genreId;
        if (params.albumId !== undefined) this.albumId = params.albumId;
        if (params.pochetteUrl !== undefined) this.pochetteUrl = params.pochetteUrl;
        if (params.dateSortie !== undefined) this.dateSortie = params.dateSortie;

        // Règle métier : voir explication en tête de réponse.
        if (this.statutModeration === 'VALIDE') {
            this.statutModeration = 'EN_ATTENTE';
            this.moderateurId = null;
            this.dateModeration = null;
        }
    }

    valider(): void {
        this.statutModeration = 'VALIDE';
        this.dateModeration = new Date();
        // moderateurId volontairement non renseigné — voir note en tête de réponse.
    }

    rejeter(): void {
        this.statutModeration = 'REJETE';
        this.dateModeration = new Date();
    }

    incrementerEcoutes(): void {
        this.nombreEcoutes += 1;
    }
}