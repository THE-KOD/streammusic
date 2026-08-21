import { ValidationError } from '../../../core/errors';

export interface AlbumProps {
    id: string;
    artisteId: string; // référence vers un Artiste — jamais modifiable après création
    titre: string;
    pochetteUrl: string | null;
    dateSortie: string; // format 'YYYY-MM-DD' — voir note ci-dessus sur le choix string vs Date
}

export class Album {
    readonly id: string;
    readonly artisteId: string;
    titre: string;
    pochetteUrl: string | null;
    dateSortie: string;

    private constructor(props: AlbumProps) {
        this.id = props.id;
        this.artisteId = props.artisteId;
        this.titre = props.titre;
        this.pochetteUrl = props.pochetteUrl;
        this.dateSortie = props.dateSortie;
    }

    static create(props: AlbumProps): Album {
        const titreNettoye = props.titre?.trim() ?? '';
        if (titreNettoye.length === 0) {
            throw new ValidationError("Le titre de l'album ne peut pas être vide.");
        }
        return new Album({ ...props, titre: titreNettoye });
    }

    // Repasse par la même validation que create() — impossible de contourner
    // la règle "titre non vide" en modifiant directement la propriété.
    renommer(nouveauTitre: string): void {
        const titreNettoye = nouveauTitre?.trim() ?? '';
        if (titreNettoye.length === 0) {
            throw new ValidationError("Le titre de l'album ne peut pas être vide.");
        }
        this.titre = titreNettoye;
    }

    // null = retirer volontairement la pochette (redevient sans image)
    modifierPochette(pochetteUrl: string | null): void {
        this.pochetteUrl = pochetteUrl;
    }
}