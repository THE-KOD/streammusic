import { Button } from '../button'

interface ErrorStateProps {
    message: string
    onRetry?: () => void
    retryLabel?: string
}

export function ErrorState({ message, onRetry, retryLabel = 'Réessayer' }: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-3 animate-fade-in">
            <p className="text-sm text-danger max-w-sm">{message}</p>
            {onRetry && (
                <Button variant="secondary" size="sm" onClick={onRetry}>
                    {retryLabel}
                </Button>
            )}
        </div>
    )
}