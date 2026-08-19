import { NotFoundError, ConflictError } from '../../../core/errors';

export class ArtisteNotFoundError extends NotFoundError {
    constructor(id: string) {
        super(`Profil artiste introuvable : ${id}`);
    }
}

// Un même compte utilisateur ne peut pas avoir deux fois un profil artiste
// (la clé primaire de `artiste` = clé étrangère vers `utilisateur`, donc
// un doublon violerait la PK côté base — on l'anticipe proprement ici).
export class DejaArtisteError extends ConflictError {
    constructor(id: string) {
        super(`L'utilisateur ${id} possède déjà un profil artiste.`);
    }
}