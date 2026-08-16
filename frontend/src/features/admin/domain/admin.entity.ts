import type { User } from '../../profile'

export interface AdminStats {
    totalUsers: number
    totalPlays: number
}

export interface DashboardTrack {
    id: string
    title: string
    artistName: string
    artistId: string
    duration: number
    playCount: number
}

export interface ModerationTrack {
    id: string
    title: string
    artistName: string
    artistId: string
    albumTitle?: string
    genreName: string
    duration: number
    releaseDate?: string
    coverUrl?: string
    status: 'pending' | 'approved' | 'rejected'
    submittedAt: string
    playCount?: number
    fileUrl: string
}

export interface AdminUser extends User {
    role: 'user' | 'artist' | 'admin'
    subscriptionTier: 'free' | 'premium'
}