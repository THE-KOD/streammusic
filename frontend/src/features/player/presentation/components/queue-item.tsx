import { Pause, Play, X, ChevronUp, ChevronDown } from 'lucide-react'
import type { Track } from '../../../../shared/types/track'
import { Spinner } from '../../../../shared/components/spinner'
import { formatDuration } from '../../../../shared/utils/format-duration'
import { Button } from '../../../../shared/components/button'
import clsx from 'clsx'

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
                              isPlaying,
                              onPlay,
                              onRemove,
                              onMoveUp,
                              onMoveDown,
                              canMoveUp,
                              canMoveDown,
                          }: QueueItemProps) {
    return (
        <div
            className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                isCurrent
                    ? 'bg-amber/10 border border-amber/30 shadow-sm'
                    : 'hover:bg-surface-raised/60 border border-transparent',
            )}
        >
            {/* Numéro / Spinner */}
            <div className="w-6 flex items-center justify-center flex-shrink-0">
                {isPlaying && isCurrent ? (
                    <Spinner size="sm" />
                ) : (
                    <span className="font-mono text-xs text-muted tabular-nums">
            {index + 1}
          </span>
                )}
            </div>

            {/* Pochette */}
            {track.coverUrl ? (
                <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                />
            ) : (
                <div className="w-10 h-10 rounded-md bg-surface-raised flex-shrink-0" />
            )}

            {/* Infos */}
            <div className="flex-1 min-w-0">
                <p
                    className={clsx(
                        'font-body text-sm truncate transition-colors',
                        isCurrent ? 'text-amber font-medium' : 'text-ivory',
                    )}
                >
                    {track.title}
                </p>
                <p className="text-xs text-muted truncate">{track.artistName}</p>
            </div>

            {/* Durée */}
            <span className="font-mono text-xs text-muted tabular-nums flex-shrink-0">
        {formatDuration(track.duration)}
      </span>

            {/* Bouton Play */}
            <Button
                variant="ghost"
                size="sm"
                onClick={onPlay}
                aria-label={isPlaying && isCurrent ? 'En cours de lecture' : 'Lire ce titre'}
                className="text-muted hover:text-ivory flex-shrink-0"
            >
                {isPlaying && isCurrent ? (
                    <Pause className="w-4 h-4" />
                ) : (
                    <Play className="w-4 h-4" />
                )}
            </Button>

            {/* Déplacement */}
            <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button
                    onClick={onMoveUp}
                    disabled={!canMoveUp}
                    aria-label="Déplacer vers le haut"
                    className="p-0.5 rounded text-muted hover:text-ivory disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronUp className="w-4 h-4" />
                </button>
                <button
                    onClick={onMoveDown}
                    disabled={!canMoveDown}
                    aria-label="Déplacer vers le bas"
                    className="p-0.5 rounded text-muted hover:text-ivory disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronDown className="w-4 h-4" />
                </button>
            </div>

            {/* Supprimer */}
            <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                aria-label="Retirer de la file"
                className="text-muted hover:text-danger transition-colors flex-shrink-0"
            >
                <X className="w-4 h-4" />
            </Button>
        </div>
    )
}