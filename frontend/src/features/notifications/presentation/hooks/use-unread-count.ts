import { useEffect, useState } from 'react'
import { notificationsService } from '../../data/notifications.service'

export function useUnreadCount() {
    const [count, setCount] = useState(0)

    useEffect(() => {
        notificationsService.getUnreadCount().then(setCount).catch(() => setCount(0))
    }, [])

    return count
}