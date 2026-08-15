// features/admin/presentation/components/moderation-row.tsx
import { ChevronRight, Circle } from 'lucide-react'
import { Button } from '../../../../shared/components/button'
import clsx from 'clsx'

interface ModerationRowProps {
    title: string
    artist: string
    genre: string
    date: string
    status: 'pending' | 'approved' | 'rejected'
    onDetail: () => void
}

const statusConfig = {
    pending: { color: 'text-amber bg-amber/10 border-amber/20', label: 'EN ATTENTE' },
    approved: { color: 'text-teal bg-teal/10 border-teal/20', label: 'VALIDE' },
    rejected: { color: 'text-danger bg-danger/10 border-danger/20', label: 'REJETE' },
}

export function ModerationRow({ title, artist, genre, date, status, onDetail }: ModerationRowProps) {
    const config = statusConfig[status]

    return (
        <div className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-raised/50 transition-all duration-200 group border border-transparent hover:border-white/5 cursor-pointer" onClick={onDetail}>
            <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto_auto] gap-2 md:gap-4 items-center">
                <span className="font-display text-sm text-ivory truncate group-hover:text-amber transition-colors">{title}</span>
                <span className="font-body text-sm text-muted truncate hidden md:block">{artist}</span>
                <span className="font-body text-sm text-muted truncate hidden md:block">{genre}</span>
                <span className="font-mono text-xs text-muted hidden md:block">{date}</span>
                <span className={clsx(
                    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    config.color
                )}>
          <Circle className="w-1.5 h-1.5 fill-current" />
                    {config.label}
        </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onDetail} aria-label="Voir le détail" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-4 h-4 text-muted" />
            </Button>
        </div>
    )
}