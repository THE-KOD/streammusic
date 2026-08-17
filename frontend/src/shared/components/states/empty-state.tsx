interface EmptyStateProps {
    title?: string
    message: string
    action?: React.ReactNode
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-3 animate-fade-in">
            {title && <h3 className="font-display text-lg text-ivory">{title}</h3>}
            <p className="text-sm text-muted max-w-sm">{message}</p>
            {action && <div className="mt-2">{action}</div>}
        </div>
    )
}