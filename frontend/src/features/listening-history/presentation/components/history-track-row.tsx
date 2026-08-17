import { Play, Clock } from 'lucide-react'
import { Button } from '../../../../shared/components/button'
import { formatDuration } from '../../../../shared/utils/format-duration'
import type { Track } from '../../../../shared/types/track'

interface HistoryTrackRowProps {
    track: Track
    listenedAt: Date
    onPlay: () => void
}

export function HistoryTrackRow({ track, listenedAt, onPlay }: HistoryTrackRowProps) {
    const timeStr = listenedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

    return (
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-raised/60 transition-colors group">
            <div className="w-10 h-10 rounded-md overflow-hidden bg-surface-raised flex-shrink-0">
                {track.coverUrl ? (
                    <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-surface-raised" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-ivory truncate group-hover:text-amber transition-colors">
                    {track.title}
                </p>
                <p className="text-xs text-muted truncate">{track.artistName}</p>
            </div>
            <span className="font-mono text-xs text-muted hidden sm:inline">{formatDuration(track.duration)}</span>
            <div className="flex items-center gap-1 text-muted">
                <Clock className="w-3 h-3" />
                <span className="font-mono text-xs">{timeStr}</span>
            </div>
            <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onPlay() }}
                aria-label="Relancer ce titre"
                className="text-muted hover:text-ivory opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Play className="w-4 h-4" />
            </Button>
        </div>
    )
}