import type { User } from './user'
import type { Track } from './track'

export interface AdminStats {
    totalUsers: number
    totalPlays: number
}

export interface DashboardTrack extends Omit<Track, 'fileUrl'> {
    playCount: number
    fileUrl?: string // optionnel pour le dashboard
}

export interface AdminUser extends Omit<User, 'subscription'> {
    isActive: boolean
    subscriptionTier: 'free' | 'premium'
    role: 'user' | 'artist' | 'admin'
    joinedAt: string
    subscription?: {
        tier: 'free' | 'premium'
        startDate?: string
        endDate?: string
    }
    genres?: string[]
}

export interface ModerationTrack extends Omit<Track, 'fileUrl'> {
    status: 'pending' | 'approved' | 'rejected'
    submittedAt: string
    artistName: string
    genreName: string
    fileUrl?: string
    releaseDate?: string
}

export interface Genre {
    id: string
    name: string
}