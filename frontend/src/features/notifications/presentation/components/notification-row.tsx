import { Bell, Music } from 'lucide-react'
import clsx from 'clsx'
import type { AppNotification } from '../../domain/notification.entity'

interface NotificationRowProps {
    notification: AppNotification
    onClick: () => void
}

export function NotificationRow({ notification, onClick }: NotificationRowProps) {
    return (
        <div
            onClick={onClick}
            className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150',
                notification.isRead ? 'hover:bg-surface-raised/40' : 'bg-surface-raised/40 hover:bg-surface-raised/60',
            )}
        >
            <div className="w-9 h-9 rounded-full bg-amber/10 flex items-center justify-center flex-shrink-0">
                {notification.type === 'NOUVELLE_SORTIE' ? <Music className="w-4 h-4 text-amber" /> : <Bell className="w-4 h-4 text-amber" />}
            </div>
            <div className="flex-1 min-w-0">
                <p className={clsx('font-body text-sm truncate', notification.isRead ? 'text-muted' : 'text-ivory')}>{notification.message}</p>
                <p className="text-xs text-muted/70 mt-0.5">{notification.sentAt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            {!notification.isRead && <span className="w-2 h-2 rounded-full bg-amber flex-shrink-0" />}
        </div>
    )
}