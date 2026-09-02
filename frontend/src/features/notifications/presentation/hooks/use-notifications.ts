import { useEffect, useState } from 'react'
import { notificationsService } from '../../data/notifications.service'
import type { AppNotification } from '../../domain/notification.entity'

export function useNotifications() {
    const [notifications, setNotifications] = useState<AppNotification[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const reload = () => {
        setIsLoading(true)
        notificationsService.listMine().then(setNotifications).catch(() => setNotifications([])).finally(() => setIsLoading(false))
    }

    useEffect(reload, [])

    const markAsRead = async (id: string) => { await notificationsService.markAsRead(id); reload() }
    const markAllAsRead = async () => { await notificationsService.markAllAsRead(); reload() }

    return { notifications, isLoading, markAsRead, markAllAsRead }
}