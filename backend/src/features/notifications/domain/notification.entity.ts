import { ValidationError } from '../../../core/errors';

export type TypeNotification = 'NOUVELLE_SORTIE' | 'SYSTEME';

export interface NotificationProps {
    id: string;
    utilisateurId: string;
    titreId: string | null; // nullable : une notif SYSTEME peut n'avoir aucun titre associé
    type: TypeNotification;
    message: string;
    dateEnvoi: Date;
    lu: boolean;
}

export class Notification {
    readonly id: string;
    readonly utilisateurId: string;
    readonly titreId: string | null;
    readonly type: TypeNotification;
    readonly message: string;
    readonly dateEnvoi: Date;
    lu: boolean;

    private constructor(props: NotificationProps) {
        this.id = props.id;
        this.utilisateurId = props.utilisateurId;
        this.titreId = props.titreId;
        this.type = props.type;
        this.message = props.message;
        this.dateEnvoi = props.dateEnvoi;
        this.lu = props.lu;
    }

    static create(props: NotificationProps): Notification {
        const messageNettoye = props.message?.trim() ?? '';
        if (messageNettoye.length === 0) {
            throw new ValidationError('Le message de la notification ne peut pas être vide.');
        }
        return new Notification({ ...props, message: messageNettoye });
    }

    marquerCommeLue(): void {
        this.lu = true;
    }
}