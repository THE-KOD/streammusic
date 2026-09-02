export interface MyTrack {
    id: string
    title: string
    coverUrl?: string
    duration: number
    status: 'EN_ATTENTE' | 'VALIDE' | 'REJETE'
    playCount: number
}