export interface AdminStats {
    totalUsers: number
    totalPlays: number
}

export interface DashboardTrack {
    id: string
    title: string
    artistName: string
    playCount: number
}

// Type autonome — ne dépend plus de features/profile. Une vue admin décrit
// ce que l'admin voit, pas ce qu'un utilisateur "est" dans son propre profil.
export interface AdminUser {
    id: string
    pseudo: string
    email: string
    avatarUrl?: string
    isActive: boolean
    joinedAt: Date
    role: 'user' | 'artist' | 'admin'
    subscriptionTier: 'free' | 'premium'
}

export interface ModerationTrack {
    id: string
    title: string
    artistId: string
    artistName: string
    albumTitle?: string
    genreName?: string
    duration: number
    releaseDate?: string
    coverUrl?: string
    status: 'pending' | 'approved' | 'rejected'
    submittedAt: string
    playCount?: number
    fileUrl: string
}