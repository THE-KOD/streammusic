import { useEffect, useState } from 'react'
import { apiClient } from '../../infrastructure/http/api-client'
import { useAuthStore } from '../store/auth-store'

const POLL_INTERVAL_MS = 30_000

// Vit dans core/ (pas features/notifications/) pour rester importable
// depuis AppHeader sans violer la règle core -> features interdit.
// Léger doublon avec notificationsService.getUnreadCount() côté feature,
// assumé pour préserver cette frontière.
export function useUnreadNotificationsCount() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!isAuthenticated) return

        const fetchCount = () => {
            apiClient.get<{ count: number }>('/notifications/mine/unread-count')
                .then((res) => setCount(res.data.count))
                .catch(() => setCount(0))
        }

        fetchCount()
        // Rafraîchissement périodique — sans ça, lire ses notifications sur
        // /notifications ne ferait jamais redescendre le badge tant que la
        // page n'est pas rechargée (AppHeader reste monté entre les routes).
        const interval = setInterval(fetchCount, POLL_INTERVAL_MS)
        return () => clearInterval(interval)
    }, [isAuthenticated])

    return count
}