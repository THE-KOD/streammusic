export interface FollowsRepository {
    isFollowing(followerId: string, artisteId: string): Promise<boolean>;
    follow(followerId: string, artisteId: string): Promise<void>;
    unfollow(followerId: string, artisteId: string): Promise<void>;
    listArtisteIdsFollowed(followerId: string): Promise<string[]>;
    // Nouveau : qui suit cet artiste — nécessaire pour notifier lors d'une nouvelle sortie.
    listFollowerIdsOf(artisteId: string): Promise<string[]>;
}

export const FOLLOWS_REPOSITORY = Symbol('FOLLOWS_REPOSITORY');