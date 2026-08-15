import clsx from 'clsx'

interface StatusBadgeProps {
    label: string
    status: 'active' | 'inactive' | 'premium' | 'free'
}

export function StatusBadge({ label, status }: StatusBadgeProps) {
    const color = {
        active: 'text-teal',
        inactive: 'text-muted',
        premium: 'text-amber',
        free: 'text-muted',
    }[status]

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted font-body">{label}</span>
            <span className={clsx('text-sm font-medium', color)}>
        ● {status === 'active' ? 'ACTIF' : status === 'premium' ? 'PREMIUM' : 'GRATUIT'}
      </span>
        </div>
    )
}