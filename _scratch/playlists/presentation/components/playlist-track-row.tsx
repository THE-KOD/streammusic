import { GripVertical } from 'lucide-react'
import { TrackActions } from './track-actions'
import { formatDuration } from '../../../../shared/utils/format-duration'
import type { PlaylistTrack } from '../../../../shared/types/playlist'

interface PlaylistTrackRowProps {
    track: PlaylistTrack
    isDraggable?: boolean
    onPlay: () => void
    onRemove: () => void
}

export function PlaylistTrackRow({
                                     track,
                                     isDraggable = false,
                                     onPlay,
                                     onRemove,
                                 }: PlaylistTrackRowProps) {
    return (
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface transition-colors group">
            {isDraggable && (
                <span className="text-muted cursor-grab">
          <GripVertical className="w-4 h-4" />
        </span>
            )}
            <span className="font-mono text-sm text-muted w-6 text-right">{track.position}</span>
            <div className="flex-1 min-w-0">
                <p className="font-display text-ivory truncate">{track.track.title}</p>
                <p className="text-sm text-muted truncate">{track.track.artistName}</p>
            </div>
            <span className="font-mono text-xs text-muted">{formatDuration(track.track.duration)}</span>
            <TrackActions onPlay={onPlay} onRemove={onRemove} />
        </div>
    )
}