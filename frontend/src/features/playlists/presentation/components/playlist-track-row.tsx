import { GripVertical } from 'lucide-react'
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
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface transition-colors group">
            {isDraggable && <span className="text-muted cursor-grab"><GripVertical className="w-4 h-4" /></span>}
            <span className="font-mono text-sm text-muted w-6 text-right">{track.position}</span>
            <div className="flex-1 min-w-0">
                <p className="font-display text-ivory truncate">{track.track.title}</p>
                <p className="text-sm text-muted truncate">{track.track.artistName}</p>
            </div>
            <span className="font-mono text-xs text-muted">{formatDuration(track.track.duration)}</span>
            <DropdownMenu ariaLabel="Actions du titre" items={items} />
        </div>
    )
}