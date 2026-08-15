import { formatDuration } from '../../../../shared/utils/format-duration'
import { DropdownMenu } from '../../../../shared/components/dropdown-menu'
import type { Track } from '../../../../shared/types/track'

interface LikedTrackRowProps {
    track: Track
    onPlay: () => void
    onRemove: () => void
}

export function LikedTrackRow({ track, onPlay, onRemove }: LikedTrackRowProps) {
    return (
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface transition-colors cursor-pointer group" onClick={onPlay}>
            <div className="w-10 h-10 rounded-md overflow-hidden bg-surface-raised flex-shrink-0">
                {track.coverUrl ? <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-surface-raised" />}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-ivory truncate">{track.title}</p>
                <p className="text-xs text-muted truncate">{track.artistName}</p>
            </div>
            <span className="font-mono text-xs text-muted">{formatDuration(track.duration)}</span>
            <div onClick={(e) => e.stopPropagation()}>
                <DropdownMenu ariaLabel="Actions du titre" items={[{ label: 'Retirer des favoris', onClick: onRemove, variant: 'danger' }]} />
            </div>
        </div>
    )
}