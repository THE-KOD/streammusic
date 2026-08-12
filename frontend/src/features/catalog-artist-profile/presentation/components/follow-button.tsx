import { Button } from '../../../../shared/components/button'

interface FollowButtonProps {
    isFollowing: boolean
    isLoading: boolean
    error: string | null
    onToggle: () => void
    onClearError: () => void
}

export function FollowButton({ isFollowing, isLoading, error, onToggle, onClearError }: FollowButtonProps) {
    if (error) {
        return (
            <div className="flex flex-col gap-2">
                <p className="text-sm text-danger">{error}</p>
                <Button variant="secondary" size="sm" onClick={onClearError}>Réessayer</Button>
            </div>
        )
    }

    return (
        <Button variant={isFollowing ? 'secondary' : 'primary'} size="md" onClick={onToggle} disabled={isLoading}>
            {isLoading ? 'Chargement...' : isFollowing ? '✓ Suivi' : 'Suivre'}
        </Button>
    )
}