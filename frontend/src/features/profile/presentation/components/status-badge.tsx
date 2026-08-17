// features/profile/presentation/components/status-badge.tsx
import clsx from 'clsx'
import { CheckCircle2, Circle, Crown } from 'lucide-react'

interface StatusBadgeProps {
    label: string
    status: 'active' | 'inactive' | 'premium' | 'free'
}

export function StatusBadge({ label, status }: StatusBadgeProps) {
    const config = {
        active: { icon: CheckCircle2, color: 'text-teal', label: 'Actif' },
        inactive: { icon: Circle, color: 'text-muted', label: 'Inactif' },
        premium: { icon: Crown, color: 'text-amber', label: 'Premium' },
        free: { icon: Circle, color: 'text-muted', label: 'Gratuit' },
    }

    const { icon: Icon, color, label: statusLabel } = config[status]

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted font-body">{label}</span>
            <span className={clsx('flex items-center gap-1.5 text-sm font-medium', color)}>
        <Icon className="w-3.5 h-3.5" />
                {statusLabel}
      </span>
        </div>
    )
}