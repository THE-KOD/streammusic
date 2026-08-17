// src/shared/components/track-row.tsx
import { Heart, Play } from 'lucide-react'
import clsx from 'clsx'
import { Spinner } from './spinner'
import { formatDuration } from '../utils/format-duration'

interface TrackRowProps {
    index?: number
    title: string
    artistName: string
    albumTitle?: string
    duration: number
    coverUrl?: string
    showCover?: boolean
    showArtist?: boolean
    isPlaying?: boolean
    isLiked?: boolean
    onPlay?: () => void
    onToggleLike?: () => void
    onArtistClick?: () => void
    onAlbumClick?: () => void
}

export function TrackRow({
                             index,
                             title,
                             artistName,
                             albumTitle,
                             duration,
                             coverUrl,
                             showCover = true,
                             showArtist = true,
                             isPlaying = false,
                             isLiked = false,
                             onPlay,
                             onToggleLike,
                             onArtistClick,
                             onAlbumClick,
                         }: TrackRowProps) {
    return (
        <div
            onClick={onPlay}
            className={clsx(
                'group grid items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150',
                showCover && albumTitle && 'grid-cols-[2rem_2.75rem_1fr_1fr_auto_2rem]',
                showCover && !albumTitle && 'grid-cols-[2rem_2.75rem_1fr_auto_2rem]',
                !showCover && albumTitle && 'grid-cols-[2rem_1fr_1fr_auto_2rem]',
                !showCover && !albumTitle && 'grid-cols-[2rem_1fr_auto_2rem]',
                isPlaying
                    ? 'bg-surface-raised border border-amber/20'
                    : 'hover:bg-surface-raised/60',
            )}
        >
            {/* Numéro / Play */}
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

            {/* Pochette */}
            {showCover &&
                (coverUrl ? (
                    <img src={coverUrl} alt="" className="w-11 h-11 rounded-md object-cover" />
                ) : (
                    <div className="w-11 h-11 rounded-md bg-surface-raised" />
                ))}

            {/* Titre + Artiste */}
            <div className="min-w-0">
                <p
                    className={clsx(
                        'font-body text-sm truncate transition-colors',
                        isPlaying ? 'text-amber' : 'text-ivory',
                    )}
                >
                    {title}
                </p>
                {showArtist && (
                    <p
                        className={clsx(
                            'font-body text-xs text-muted truncate transition-colors',
                            onArtistClick && 'hover:text-ivory cursor-pointer',
                        )}
                        onClick={onArtistClick ? (e) => { e.stopPropagation(); onArtistClick() } : undefined}
                    >
                        {artistName}
                    </p>
                )}
            </div>

            {/* Album */}
            {albumTitle && (
                <p
                    className={clsx(
                        'hidden md:block text-sm text-muted truncate transition-colors',
                        onAlbumClick && 'hover:text-ivory cursor-pointer',
                    )}
                    onClick={onAlbumClick ? (e) => { e.stopPropagation(); onAlbumClick() } : undefined}
                >
                    {albumTitle}
                </p>
            )}

            {/* Durée */}
            <span className="font-mono text-xs text-muted">{formatDuration(duration)}</span>

            {/* Like */}
            <button
                onClick={(e) => { e.stopPropagation(); onToggleLike?.() }}
                aria-label={isLiked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                className={clsx(
                    'transition-all duration-200',
                    isLiked ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100 scale-90 group-hover:scale-100',
                )}
            >
                <Heart
                    className={clsx(
                        'w-4 h-4 transition-colors',
                        isLiked ? 'text-teal fill-teal' : 'text-muted hover:text-ivory',
                    )}
                />
            </button>
        </div>
    )
}