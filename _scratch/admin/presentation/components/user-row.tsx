// features/admin/presentation/components/user-row.tsx
import { ChevronRight } from 'lucide-react' // User retiré
import { Avatar } from '../../../../shared/components/avatar'
import { Button } from '../../../../shared/components/button'
import clsx from 'clsx'

interface UserRowProps {
    pseudo: string
    email: string
    isActive: boolean
    joinedAt: string
    onDetail: () => void
}

export function UserRow({ pseudo, email, isActive, joinedAt, onDetail }: UserRowProps) {
    return (
        <div className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-raised/50 transition-all duration-200 group border border-transparent hover:border-white/5 cursor-pointer" onClick={onDetail}>
            <div className="flex-shrink-0 border-2 border-white/5 rounded-full">
                <Avatar name={pseudo} size="sm" />
            </div>
            <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-2 md:gap-4 items-center">
                <span className="font-body text-sm font-medium text-ivory truncate">{pseudo}</span>
                <span className="font-body text-sm text-muted truncate hidden md:block">{email}</span>
                <span className={clsx(
                    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
                    isActive ? 'bg-teal/10 text-teal' : 'bg-danger/10 text-danger'
                )}>
                    <span className={clsx('w-1.5 h-1.5 rounded-full', isActive ? 'bg-teal' : 'bg-danger')} />
                    {isActive ? 'ACTIF' : 'SUSPENDU'}
                </span>
                <span className="font-mono text-xs text-muted hidden md:block">{joinedAt}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onDetail} aria-label="Voir le détail" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-4 h-4 text-muted" />
            </Button>
        </div>
    )
}