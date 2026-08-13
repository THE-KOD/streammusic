export interface User {
    id: string
    pseudo: string
    email: string
    avatarUrl?: string
    joinedAt: Date
    subscription: 'free' | 'premium'
    genres: string[]
    subscriptionStart?: Date
    subscriptionEnd?: Date
}