import { ValidationError } from '../../../core/errors';

export type Visibilite = 'PUBLIQUE' | 'PRIVEE';

export interface PlaylistProps {
    id: string;
    proprietaireId: string; // jamais modifiable après création
    nom: string;
    visibilite: Visibilite;
    dateCreation: Date;
}

export class Playlist {
    readonly id: string;
    readonly proprietaireId: string;
    nom: string;
    visibilite: Visibilite;
    readonly dateCreation: Date;

    private constructor(props: PlaylistProps) {
        this.id = props.id;
        this.proprietaireId = props.proprietaireId;
        this.nom = props.nom;
        this.visibilite = props.visibilite;
        this.dateCreation = props.dateCreation;
    }

    static create(props: PlaylistProps): Playlist {
        const nomNettoye = props.nom?.trim() ?? '';
        if (nomNettoye.length === 0) {
            throw new ValidationError('Le nom de la playlist ne peut pas être vide.');
        }
        return new Playlist({ ...props, nom: nomNettoye });
    }

    // Comparaison centralisée ici plutôt que répétée dans chaque méthode
    // du service — un seul endroit à faire évoluer si la règle change un jour
    // (ex. autoriser un collaborateur en V2, comme prévu dans le contrat d'architecture).
    estProprietaire(utilisateurId: string): boolean {
        return this.proprietaireId === utilisateurId;
    }

    get estPublique(): boolean {
        return this.visibilite === 'PUBLIQUE';
    }

    renommer(nouveauNom: string): void {
        const nomNettoye = nouveauNom?.trim() ?? '';
        if (nomNettoye.length === 0) {
            throw new ValidationError('Le nom de la playlist ne peut pas être vide.');
        }
        this.nom = nomNettoye;
    }

    changerVisibilite(visibilite: Visibilite): void {
        this.visibilite = visibilite;
    }
}