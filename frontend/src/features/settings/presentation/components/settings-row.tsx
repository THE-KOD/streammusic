// features/settings/presentation/components/settings-row.tsx
import { ChevronRight } from 'lucide-react'
import clsx from 'clsx'

interface SettingsRowProps {
    icon: React.ReactNode
    title: string
    description: string
    onClick?: () => void
    status?: string
    statusColor?: string
}

export function SettingsRow({ icon, title, description, onClick, status, statusColor = 'text-muted' }: SettingsRowProps) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface-raised/50 transition-all duration-150 text-left group"
            disabled={!onClick}
        >
            <span className="text-muted group-hover:text-ivory transition-colors shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-ivory">{title}</p>
                <p className="text-xs text-muted truncate">{description}</p>
            </div>
            {status && (
                <span className={clsx('text-xs font-mono font-medium', statusColor)}>
          {status}
        </span>
            )}
            {onClick && (
                <ChevronRight className="w-4 h-4 text-muted/50 group-hover:text-muted transition-colors shrink-0" />
            )}
        </button>
    )
}