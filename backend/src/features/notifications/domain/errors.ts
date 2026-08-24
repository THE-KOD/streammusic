import { NotFoundError, ForbiddenError } from '../../../core/errors';

export class NotificationNotFoundError extends NotFoundError {
    constructor(id: string) {
        super(`Notification introuvable : ${id}`);
    }
}

export class NotificationForbiddenError extends ForbiddenError {
    constructor() {
        super("Vous ne pouvez pas accéder à la notification d'un autre utilisateur.");
    }
}