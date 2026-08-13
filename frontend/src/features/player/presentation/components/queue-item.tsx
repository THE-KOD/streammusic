import { Pause, Play, X, ChevronUp, ChevronDown } from 'lucide-react'
import type { Track } from '../../../../shared/types/track'
import { Spinner } from '../../../../shared/components/spinner'
import { formatDuration } from '../../../../shared/utils/format-duration'
import { Button } from '../../../../shared/components/button'

interface QueueItemProps {
    track: Track
    index: number
    isCurrent: boolean
    isPlaying: boolean
    onPlay: () => void
    onRemove: () => void
    onMoveUp: () => void
    onMoveDown: () => void
    canMoveUp: boolean
    canMoveDown: boolean
}

export function QueueItem({ track, index, isCurrent, isPlaying, onPlay, onRemove, onMoveUp, onMoveDown, canMoveUp, canMoveDown }: QueueItemProps) {
    return (
        <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isCurrent ? 'bg-surface-raised border border-amber/30' : 'hover:bg-surface'}`}>
            <div className="w-6 flex items-center justify-center">
                {isPlaying ? <Spinner size="sm" /> : <span className="font-mono text-xs text-muted">{index + 1}</span>}
            </div>

            {track.coverUrl ? (
                <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded-md object-cover" />
            ) : (
                <div className="w-10 h-10 rounded-md bg-surface-raised flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0">
                <p className={`font-body text-sm truncate ${isCurrent ? 'text-amber' : 'text-ivory'}`}>{track.title}</p>
                <p className="text-xs text-muted truncate">{track.artistName}</p>
            </div>

            <span className="font-mono text-xs text-muted">{formatDuration(track.duration)}</span>

            <Button variant="ghost" size="sm" onClick={onPlay} aria-label={isPlaying ? 'En cours de lecture' : 'Lire ce titre'} className="text-muted hover:text-ivory">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            <div className="flex flex-col gap-0.5">
                <Button variant="ghost" size="sm" onClick={onMoveUp} disabled={!canMoveUp} aria-label="Déplacer vers le haut" className="p-0.5 text-muted hover:text-ivory disabled:opacity-30">
                    <ChevronUp className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onMoveDown} disabled={!canMoveDown} aria-label="Déplacer vers le bas" className="p-0.5 text-muted hover:text-ivory disabled:opacity-30">
                    <ChevronDown className="w-3 h-3" />
                </Button>
            </div>

            <Button variant="ghost" size="sm" onClick={onRemove} aria-label="Retirer de la file" className="text-muted hover:text-danger">
                <X className="w-4 h-4" />
            </Button>
        </div>
    )
}