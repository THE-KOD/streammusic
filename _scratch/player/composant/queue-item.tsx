import { Play, X, ChevronUp, ChevronDown } from 'lucide-react'
import type {Track} from '../../../frontend/src/features/player/presentation/store/player-store'
import { formatDuration } from '../../../frontend/src/shared/utils/format-duration'
import { Button } from '../../../frontend/src/shared/components/button'

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

export function QueueItem({
                              track,
                              index,
                              isCurrent,
                              onPlay,
                              onRemove,
                              onMoveUp,
                              onMoveDown,
                              canMoveUp,
                              canMoveDown,
                          }: QueueItemProps) {
    return (
        <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isCurrent ? 'bg-surface-raised border border-amber/30' : 'hover:bg-surface'
            }`}
        >
            <span className="font-mono text-xs text-muted w-6 text-right">{index + 1}</span>

            {track.coverUrl ? (
                <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded-md object-cover" />
            ) : (
                <div className="w-10 h-10 rounded-md bg-surface-raised flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0">
                <p className={`font-body text-sm truncate ${isCurrent ? 'text-amber' : 'text-ivory'}`}>
                    {track.title}
                </p>
                <p className="text-xs text-muted truncate">{track.artist}</p>
            </div>

            <span className="font-mono text-xs text-muted">{formatDuration(track.duration)}</span>

            <Button
                variant="ghost"
                size="sm"
                onClick={onPlay}
                aria-label="Lire ce titre"
                className="text-muted hover:text-ivory"
            >
                <Play className="w-4 h-4" />
            </Button>

            <div className="flex flex-col gap-0.5">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMoveUp}
                    disabled={!canMoveUp}
                    aria-label="Déplacer vers le haut"
                    className="p-0.5 text-muted hover:text-ivory disabled:opacity-30"
                >
                    <ChevronUp className="w-3 h-3" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMoveDown}
                    disabled={!canMoveDown}
                    aria-label="Déplacer vers le bas"
                    className="p-0.5 text-muted hover:text-ivory disabled:opacity-30"
                >
                    <ChevronDown className="w-3 h-3" />
                </Button>
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                aria-label="Retirer de la file"
                className="text-muted hover:text-danger"
            >
                <X className="w-4 h-4" />
            </Button>
        </div>
    )
}