import { ChevronRight } from 'lucide-react'

interface SettingsRowProps {
    icon: React.ReactNode
    title: string
    description: string
    onClick?: () => void
    status?: string
}

export function SettingsRow({ icon, title, description, onClick, status }: SettingsRowProps) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-surface transition-colors text-left"
        >
            <span className="text-muted">{icon}</span>
            <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-ivory">{title}</p>
                <p className="text-xs text-muted truncate">{description}</p>
            </div>
            {status && <span className="text-xs text-muted font-mono mr-1">{status}</span>}
            <ChevronRight className="w-4 h-4 text-muted flex-shrink-0" />
        </button>
    )
}