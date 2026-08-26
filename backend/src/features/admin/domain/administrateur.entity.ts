export interface AdministrateurProps {
    id: string; // même id que l'utilisateur associé — table par sous-classe, comme Artiste
    niveauAcces: string;
}

export class Administrateur {
    readonly id: string;
    readonly niveauAcces: string;

    private constructor(props: AdministrateurProps) {
        this.id = props.id;
        this.niveauAcces = props.niveauAcces;
    }

    static create(props: AdministrateurProps): Administrateur {
        return new Administrateur(props);
    }
}