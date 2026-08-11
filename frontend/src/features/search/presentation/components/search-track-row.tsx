import { Heart, Play, Pause } from 'lucide-react'  // ← ajout de Pause
import clsx from 'clsx'
import { formatDuration } from '../../../../shared/utils/format-duration'
import { Button } from '../../../../shared/components/button'

interface SearchTrackRowProps {
    title: string
    artist: string
    album: string
    duration: number
    coverUrl?: string
    isPlaying?: boolean
    isLiked?: boolean
    onPlay?: () => void
    onToggleLike?: () => void
    onArtistClick?: () => void
    onAlbumClick?: () => void
}

export function SearchTrackRow({
                                   title,
                                   artist,
                                   album,
                                   duration,
                                   coverUrl,
                                   isPlaying = false,
                                   isLiked = false,
                                   onPlay,
                                   onToggleLike,
                                   onArtistClick,
                                   onAlbumClick,
                               }: SearchTrackRowProps) {
    return (
        <div className="grid grid-cols-[3rem_1fr_1fr_1fr_auto_auto] items-center gap-4 px-3 py-2 rounded-lg hover:bg-surface transition-colors">
            <div className="w-10 h-10 rounded-md overflow-hidden bg-surface-raised flex-shrink-0">
                {coverUrl ? (
                    <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-surface-raised" />
                )}
            </div>
            <p className="font-body text-sm text-ivory truncate">{title}</p>
            <p
                className="text-sm text-muted truncate hover:text-ivory cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onArtistClick?.() }}
            >
                {artist}
            </p>
            <p
                className="text-sm text-muted truncate hover:text-ivory cursor-pointer hidden md:block"
                onClick={(e) => { e.stopPropagation(); onAlbumClick?.() }}
            >
                {album}
            </p>
            <span className="font-mono text-xs text-muted">{formatDuration(duration)}</span>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onToggleLike?.() }}
                    aria-label={isLiked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                    <Heart className={clsx('w-4 h-4', isLiked ? 'text-teal fill-current' : 'text-muted')} />
                </Button>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onPlay?.() }}
                >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
            </div>
        </div>
    )
}