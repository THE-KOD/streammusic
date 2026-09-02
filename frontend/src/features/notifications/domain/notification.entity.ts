import type { Track } from '../../../shared/types/track'

export interface AppNotification {
    id: string
    type: 'NOUVELLE_SORTIE' | 'SYSTEME'
    message: string
    sentAt: Date
    isRead: boolean
    track: Track | null
}