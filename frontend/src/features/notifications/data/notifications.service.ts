import { apiClient } from '../../../infrastructure/http/api-client'
import { mapTrackResponse, type BackendTrackDto } from '../../../shared/utils/map-track-response'
import type { AppNotification } from '../domain/notification.entity'

interface BackendNotificationDto {
    id: string
    type: 'NOUVELLE_SORTIE' | 'SYSTEME'
    message: string
    dateEnvoi: string
    lu: boolean
    track: BackendTrackDto | null
}

function mapNotification(dto: BackendNotificationDto): AppNotification {
    return { id: dto.id, type: dto.type, message: dto.message, sentAt: new Date(dto.dateEnvoi), isRead: dto.lu, track: dto.track ? mapTrackResponse(dto.track) : null }
}

export const notificationsService = {
    async listMine(): Promise<AppNotification[]> {
        const { data } = await apiClient.get<BackendNotificationDto[]>('/notifications/mine')
        return data.map(mapNotification)
    },
    async getUnreadCount(): Promise<number> {
        const { data } = await apiClient.get<{ count: number }>('/notifications/mine/unread-count')
        return data.count
    },
    async markAsRead(id: string): Promise<void> {
        await apiClient.patch(`/notifications/${id}/read`)
    },
    async markAllAsRead(): Promise<void> {
        await apiClient.patch('/notifications/mine/read-all')
    },
}