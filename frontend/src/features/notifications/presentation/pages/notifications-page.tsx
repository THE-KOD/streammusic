import { Bell } from 'lucide-react'
import { Button } from '../../../../shared/components/button'
import { LoadingState, EmptyState } from '../../../../shared/components/states'
import { NotificationRow } from '../components/notification-row'
import { useNotifications } from '../hooks/use-notifications'
import { usePlayerStore } from '../../../player/presentation/store/player-store'
import type {AppNotification} from "../../domain/notification.entity.ts";

export function NotificationsPage() {
    const { notifications, isLoading, markAsRead, markAllAsRead } = useNotifications()
    const playTrack = usePlayerStore((state) => state.playTrack)

    const handleClick = async (id: string, track: AppNotification['track']) => {
        await markAsRead(id)
        if (track) playTrack(track)
    }

    if (isLoading) return <LoadingState />

    return (
        <div className="space-y-6">
            <div className="relative p-6 rounded-xl bg-gradient-to-br from-surface to-surface-raised border border-white/5 overflow-hidden">
                <div className="absolute -right-12 -top-12 w-40 h-40 bg-amber/10 rounded-full blur-2xl" />
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Bell className="w-8 h-8 text-amber" />
                        <div>
                            <h1 className="font-display text-3xl md:text-4xl font-semibold text-ivory">Notifications</h1>
                            <p className="text-muted text-sm mt-1">{notifications.length} notification{notifications.length > 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    {notifications.some((n) => !n.isRead) && (
                        <Button variant="ghost" size="sm" onClick={markAllAsRead}>Tout marquer comme lu</Button>
                    )}
                </div>
            </div>

            {notifications.length === 0 ? (
                <EmptyState title="Aucune notification" message="Vos notifications apparaîtront ici." />
            ) : (
                <div className="space-y-1">
                    {notifications.map((n) => (
                        <NotificationRow key={n.id} notification={n} onClick={() => handleClick(n.id, n.track)} />
                    ))}
                </div>
            )}
        </div>
    )
}