export interface SessionProps {
    id: string;
    utilisateurId: string;
    refreshTokenHash: string;
    dateCreation: Date;
    dateExpiration: Date;
    revoque: boolean;
}

export class Session {
    readonly id: string;
    readonly utilisateurId: string;
    readonly refreshTokenHash: string;
    readonly dateCreation: Date;
    readonly dateExpiration: Date;
    revoque: boolean;

    constructor(props: SessionProps) {
        this.id = props.id;
        this.utilisateurId = props.utilisateurId;
        this.refreshTokenHash = props.refreshTokenHash;
        this.dateCreation = props.dateCreation;
        this.dateExpiration = props.dateExpiration;
        this.revoque = props.revoque;
    }

    get estValide(): boolean {
        return !this.revoque && this.dateExpiration.getTime() > Date.now();
    }

    revoquer(): void {
        this.revoque = true;
    }
}