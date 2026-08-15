import { Card } from '../../../../shared/components/card'
import { Button } from '../../../../shared/components/button'
import { DropdownMenu } from '../../../../shared/components/dropdown-menu'
import type { Playlist } from '../../domain/playlist.entity'

interface PlaylistCardProps {
    playlist: Playlist
    onOpen: () => void
    onRename: () => void
    onVisibilityChange: () => void
    onDelete: () => void
}

export function PlaylistCard({ playlist, onOpen, onRename, onVisibilityChange, onDelete }: PlaylistCardProps) {
    const visibilityLabel = playlist.isPublic ? 'Publique' : 'Privée'
    return (
        <Card className="flex flex-col gap-2">
            <h3 className="font-display text-2xl font-semibold text-ivory">{playlist.name}</h3>
            <div className="text-sm text-muted font-body">{visibilityLabel} · {playlist.trackCount} titre{playlist.trackCount > 1 ? 's' : ''}</div>
            <div className="flex items-center justify-between mt-2">
                <Button variant="secondary" size="sm" onClick={onOpen}>Ouvrir</Button>
                <DropdownMenu
                    ariaLabel="Actions de la playlist"
                    items={[
                        { label: 'Renommer', onClick: onRename },
                        { label: 'Modifier visibilité', onClick: onVisibilityChange },
                        { label: 'Supprimer', onClick: onDelete, variant: 'danger' },
                    ]}
                />
            </div>
        </Card>
    )
}