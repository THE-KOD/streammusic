export interface QueueTrackEntry {
    titreId: string;
    ordre: number;
}

export interface QueueRepository {
    // null = l'utilisateur n'a encore jamais ajouté de titre à sa file.
    findFileIdByUtilisateur(utilisateurId: string): Promise<string | null>;
    // Création paresseuse — jamais appelée à l'inscription, voir note en tête de réponse.
    createFile(utilisateurId: string): Promise<string>;

    list(fileId: string): Promise<QueueTrackEntry[]>;
    isPresent(fileId: string, titreId: string): Promise<boolean>;
    getMaxOrdre(fileId: string): Promise<number>;
    add(fileId: string, titreId: string, ordre: number): Promise<void>;
    remove(fileId: string, titreId: string): Promise<void>;
    reorderAll(fileId: string, entries: QueueTrackEntry[]): Promise<void>;
    clear(fileId: string): Promise<void>;
}

export const QUEUE_REPOSITORY = Symbol('QUEUE_REPOSITORY');