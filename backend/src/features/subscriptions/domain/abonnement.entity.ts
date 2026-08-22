import { ValidationError } from '../../../core/errors';

export type TypeAbonnement = 'GRATUIT' | 'PREMIUM';

export interface AbonnementProps {
    id: string;
    utilisateurId: string; // relation 1-1 stricte avec utilisateur (UNIQUE en base)
    type: TypeAbonnement;
    dateDebut: string; // format 'YYYY-MM-DD' — voir catalog-albums pour l'explication du choix string vs Date
    dateFin: string | null;
}

export class Abonnement {
    readonly id: string;
    readonly utilisateurId: string;
    type: TypeAbonnement;
    dateDebut: string;
    dateFin: string | null;

    private constructor(props: AbonnementProps) {
        this.id = props.id;
        this.utilisateurId = props.utilisateurId;
        this.type = props.type;
        this.dateDebut = props.dateDebut;
        this.dateFin = props.dateFin;
    }

    static create(props: AbonnementProps): Abonnement {
        // Miroir applicatif de la contrainte chk_dates_abonnement du schéma SQL —
        // comparaison de chaînes valide ici car le format 'YYYY-MM-DD' se trie
        // alphabétiquement dans le même ordre que chronologiquement.
        if (props.dateFin !== null && props.dateFin < props.dateDebut) {
            throw new ValidationError('La date de fin ne peut pas précéder la date de début.');
        }
        return new Abonnement(props);
    }

    get estPremium(): boolean {
        return this.type === 'PREMIUM';
    }

    // Détecte un abonnement premium arrivé à expiration mais pas encore
    // repassé à GRATUIT en base. Non branché à une action automatique pour
    // l'instant (ça demanderait un job planifié, hors scope des endpoints
    // REST de cette phase) — utilisable plus tard si on ajoute ce mécanisme.
    get estExpire(): boolean {
        if (this.type !== 'PREMIUM' || !this.dateFin) return false;
        const aujourdHui = new Date().toISOString().slice(0, 10);
        return this.dateFin < aujourdHui;
    }

    passerPremium(dureeEnMois = 1): void {
        const debut = new Date();
        const fin = new Date(debut);
        fin.setMonth(fin.getMonth() + dureeEnMois);
        this.type = 'PREMIUM';
        this.dateDebut = debut.toISOString().slice(0, 10);
        this.dateFin = fin.toISOString().slice(0, 10);
    }

    revenirGratuit(): void {
        this.type = 'GRATUIT';
        this.dateDebut = new Date().toISOString().slice(0, 10);
        this.dateFin = null; // un abonnement gratuit n'expire jamais
    }
}