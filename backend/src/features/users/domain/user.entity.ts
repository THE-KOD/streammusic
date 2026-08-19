import { ValidationError } from '../../../core/errors';

export type StatutCompte = 'ACTIF' | 'SUSPENDU';

export interface UtilisateurProps {
    id: string;
    pseudo: string;
    email: string;
    motDePasseHash: string | null;
    oauthProvider: string | null;
    oauthId: string | null;
    photoProfilUrl: string | null;
    statutCompte: StatutCompte;
    dateInscription: Date;
}

export class Utilisateur {
    readonly id: string;
    pseudo: string;
    email: string;
    motDePasseHash: string | null;
    oauthProvider: string | null;
    oauthId: string | null;
    photoProfilUrl: string | null;
    statutCompte: StatutCompte;
    readonly dateInscription: Date;

    private constructor(props: UtilisateurProps) {
        this.id = props.id;
        this.pseudo = props.pseudo;
        this.email = props.email;
        this.motDePasseHash = props.motDePasseHash;
        this.oauthProvider = props.oauthProvider;
        this.oauthId = props.oauthId;
        this.photoProfilUrl = props.photoProfilUrl;
        this.statutCompte = props.statutCompte;
        this.dateInscription = props.dateInscription;
    }

    /**
     * Miroir volontaire des contraintes SQL chk_auth_method / chk_oauth_pair —
     * on rejette une donnée invalide ici, avant même qu'elle atteigne la base,
     * plutôt que de compter uniquement sur la contrainte MySQL.
     */
    static create(props: UtilisateurProps): Utilisateur {
        const aMotDePasse = props.motDePasseHash !== null;
        const aOAuthId = props.oauthId !== null;
        const aOAuthProvider = props.oauthProvider !== null;

        if (!aMotDePasse && !aOAuthId) {
            throw new ValidationError(
                "Un utilisateur doit avoir soit un mot de passe, soit une identité OAuth.",
            );
        }
        if (aOAuthId !== aOAuthProvider) {
            throw new ValidationError(
                'oauthProvider et oauthId doivent être renseignés ensemble.',
            );
        }

        return new Utilisateur(props);
    }

    get peutSeConnecterParMotDePasse(): boolean {
        return this.motDePasseHash !== null;
    }

    get estConnecteViaOAuth(): boolean {
        return this.oauthId !== null;
    }

    get estActif(): boolean {
        return this.statutCompte === 'ACTIF';
    }

    suspendre(): void {
        this.statutCompte = 'SUSPENDU';
    }

    reactiver(): void {
        this.statutCompte = 'ACTIF';
    }
}