// features/playlists/presentation/components/playlist-track-row.tsx
import { GripVertical, MoreHorizontal } from 'lucide-react'
import { DropdownMenu, type DropdownMenuItem } from '../../../../shared/components/dropdown-menu'
import { formatDuration } from '../../../../shared/utils/format-duration'
import type { PlaylistTrack } from '../../domain/playlist.entity'

interface PlaylistTrackRowProps {
    track: PlaylistTrack
    isDraggable?: boolean
    onPlay: () => void
    onAddToQueue?: () => void
    onRemove: () => void
}

export function PlaylistTrackRow({ track, isDraggable = false, onPlay, onAddToQueue, onRemove }: PlaylistTrackRowProps) {
    const items: DropdownMenuItem[] = [
        { label: 'Lire', onClick: onPlay },
        ...(onAddToQueue ? [{ label: 'Ajouter à la file', onClick: onAddToQueue }] : []),
        { label: 'Retirer de la playlist', onClick: onRemove, variant: 'danger' as const },
    ]

    return (
        <div className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-raised/60 transition-colors">
            {isDraggable && (
                <span className="text-muted cursor-grab hover:text-ivory transition-colors">
          <GripVertical className="w-4 h-4" />
        </span>
            )}
            <span className="font-mono text-sm text-muted w-6 text-right">{track.position}</span>
            <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-1">
                <p className="font-body text-ivory truncate">{track.track.title}</p>
                <p className="text-sm text-muted truncate md:text-right">{track.track.artistName}</p>
            </div>
            <span className="font-mono text-xs text-muted">{formatDuration(track.track.duration)}</span>
            <DropdownMenu
                ariaLabel="Actions du titre"
                trigger={<MoreHorizontal className="w-4 h-4 text-muted group-hover:text-ivory transition-colors" />}
                items={items}
            />
        </div>
    )
}