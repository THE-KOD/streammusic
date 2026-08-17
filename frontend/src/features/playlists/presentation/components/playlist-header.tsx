// features/playlists/presentation/components/playlist-header.tsx
import { Play, MoreHorizontal } from 'lucide-react'
import { Card } from '../../../../shared/components/card'
import { Button } from '../../../../shared/components/button'
import { DropdownMenu } from '../../../../shared/components/dropdown-menu'
import { formatDuration } from '../../../../shared/utils/format-duration'
import type { Playlist } from '../../domain/playlist.entity'

interface PlaylistHeaderProps {
    playlist: Playlist
    totalDuration: number
    onPlay: () => void
    onRename: () => void
    onVisibilityChange: () => void
    onDelete: () => void
}

const getColor = (name: string) => {
    const colors = ['#4FB6A8', '#E3A72F', '#E0605A', '#8B92A3', '#EDEAE2']
    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
}

export function PlaylistHeader({ playlist, totalDuration, onPlay, onRename, onVisibilityChange, onDelete }: PlaylistHeaderProps) {
    const bgColor = getColor(playlist.name)

    return (
        <Card className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 border border-white/5 bg-gradient-to-br from-surface to-surface-raised">
            {/* Pochette grande */}
            <div
                className="w-40 h-40 md:w-48 md:h-48 rounded-xl flex items-center justify-center text-5xl font-display font-semibold shadow-2xl flex-shrink-0"
                style={{ backgroundColor: bgColor, color: '#14181F' }}
            >
                {playlist.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wider text-muted font-body">Playlist</p>
                <h1 className="font-display text-3xl md:text-4xl font-semibold text-ivory truncate">
                    {playlist.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted font-body">
                    <span>{playlist.trackCount} titre{playlist.trackCount > 1 ? 's' : ''}</span>
                    <span className="w-1 h-1 rounded-full bg-muted/40" />
                    <span>{playlist.isPublic ? 'Publique' : 'Privée'}</span>
                    {totalDuration > 0 && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-muted/40" />
                            <span className="font-mono">{formatDuration(totalDuration)}</span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
                <Button variant="primary" size="md" onClick={onPlay} disabled={playlist.trackCount === 0}>
                    <Play className="w-4 h-4" fill="currentColor" />
                    Lire
                </Button>
                <DropdownMenu
                    ariaLabel="Actions de la playlist"
                    trigger={<MoreHorizontal className="w-5 h-5 text-muted hover:text-ivory transition-colors" />}
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