// Un artiste ne DUPLIQUE jamais les infos de l'utilisateur (pseudo, email...) —
// il ne porte que ce qui est spécifique au rôle "artiste".
export interface ArtisteProps {
    id: string; // volontairement identique à l'id de l'utilisateur associé (relation 1-1)
    biographie: string | null;
    photoArtisteUrl: string | null;
}

export class Artiste {
    readonly id: string;
    biographie: string | null;
    photoArtisteUrl: string | null;

    private constructor(props: ArtisteProps) {
        this.id = props.id;
        this.biographie = props.biographie;
        this.photoArtisteUrl = props.photoArtisteUrl;
    }

    static create(props: ArtisteProps): Artiste {
        return new Artiste(props);
    }

    // undefined = "ne pas toucher à ce champ" (mise à jour partielle),
    // à distinguer de null = "effacer volontairement la valeur existante".
    modifierProfil(biographie?: string | null, photoArtisteUrl?: string | null): void {
        if (biographie !== undefined) this.biographie = biographie;
        if (photoArtisteUrl !== undefined) this.photoArtisteUrl = photoArtisteUrl;
    }
}