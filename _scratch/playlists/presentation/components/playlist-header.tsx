import { Card } from '../../../../shared/components/card'
import { Button } from '../../../../shared/components/button'
import { PlaylistActions } from './playlist-actions'
import type { Playlist } from '../../../../shared/types/playlist'

interface PlaylistHeaderProps {
    playlist: Playlist
    onPlay: () => void
    onRename: () => void
    onVisibilityChange: () => void
    onDelete: () => void
}

export function PlaylistHeader({
                                   playlist,
                                   onPlay,
                                   onRename,
                                   onVisibilityChange,
                                   onDelete,
                               }: PlaylistHeaderProps) {
    const visibilityLabel = playlist.isPublic ? 'Publique' : 'Privée'

    return (
        <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="font-display text-4xl font-semibold text-ivory">{playlist.name}</h1>
                <p className="text-sm text-muted font-body">
                    {visibilityLabel} · {playlist.trackCount} titre{playlist.trackCount > 1 ? 's' : ''}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="primary" size="md" onClick={onPlay} disabled={playlist.trackCount === 0}>
                    ▶ Lire
                </Button>
                <PlaylistActions
                    onRename={onRename}
                    onVisibilityChange={onVisibilityChange}
                    onDelete={onDelete}
                />
            </div>
        </Card>
    )
}