import { type MouseEvent } from 'react'
import { Heart, Play } from 'lucide-react'
import clsx from 'clsx'
import { Spinner } from './spinner'
import { formatDuration } from '../utils/format-duration'

interface TrackRowProps {
    index?: number
    title: string
    artistName: string
    duration: number
    coverUrl?: string
    isPlaying?: boolean
    isLiked?: boolean
    onPlay?: () => void
    onToggleLike?: () => void
}

export function TrackRow({
                             index,
                             title,
                             artistName,
                             duration,
                             coverUrl,
                             isPlaying = false,
                             isLiked = false,
                             onPlay,
                             onToggleLike,
                         }: TrackRowProps) {
    const handleLikeClick = (event: MouseEvent) => {
        event.stopPropagation()
        onToggleLike?.()
    }

    return (
        <div
            onClick={onPlay}
            className={clsx(
                'group grid grid-cols-[2rem_2.75rem_1fr_auto_2rem] items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors',
                isPlaying ? 'bg-surface-raised' : 'hover:bg-surface',
            )}
        >
            <div className="flex items-center justify-center text-muted font-mono text-sm">
                {isPlaying ? (
                    <Spinner size="sm" />
                ) : (
                    <>
                        <span className="group-hover:hidden">{index}</span>
                        <Play className="hidden group-hover:block w-4 h-4 text-ivory" fill="currentColor" />
                    </>
                )}
            </div>

            {coverUrl ? (
                <img src={coverUrl} alt="" className="w-11 h-11 rounded-md object-cover" />
            ) : (
                <div className="w-11 h-11 rounded-md bg-surface-raised" />
            )}

            <div className="min-w-0">
                <p className={clsx('font-body text-sm truncate', isPlaying ? 'text-amber' : 'text-ivory')}>
                    {title}
                </p>
                <p className="font-body text-xs text-muted truncate">{artistName}</p>
            </div>

            <span className="font-mono text-xs text-muted">{formatDuration(duration)}</span>

            <button
                onClick={handleLikeClick}
                aria-label={isLiked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                className={clsx(
                    'transition-opacity',
                    isLiked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
                )}
            >
                <Heart
                    className={clsx('w-4 h-4', isLiked ? 'text-teal' : 'text-muted hover:text-ivory')}
                    fill={isLiked ? 'currentColor' : 'none'}
                />
            </button>
        </div>
    )
}