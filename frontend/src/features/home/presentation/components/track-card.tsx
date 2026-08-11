import { Card } from '../../../../shared/components/card'
import { Button } from '../../../../shared/components/button'
import { Heart } from 'lucide-react'
import clsx from 'clsx'
import { formatDuration } from '../../../../shared/utils/format-duration'

interface TrackCardProps {
    title: string
    artist: string
    album?: string
    duration: number
    coverUrl?: string
    playCount?: number
    isPlaying?: boolean
    isLiked?: boolean
    onPlay?: () => void
    onToggleLike?: () => void
    onArtistClick?: () => void
    onAlbumClick?: () => void
}

export function TrackCard({
                              title,
                              artist,
                              album,
                              duration,
                              coverUrl,
                              playCount,
                              isPlaying = false,
                              isLiked = false,
                              onPlay,
                              onToggleLike,
                              onArtistClick,
                              onAlbumClick,
                          }: TrackCardProps) {
    return (
        <Card className="group cursor-pointer hover:bg-surface-raised transition-colors">
            <div className="flex flex-col gap-2">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-raised">
                    {coverUrl ? (
                        <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-surface-raised flex items-center justify-center text-muted">No cover</div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); onPlay?.() }}
                            className="rounded-full p-3"
                        >
                            {isPlaying ? '⏸' : '▶'}
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col min-w-0">
                    <p className="font-display text-sm font-medium text-ivory truncate">{title}</p>
                    <p
                        className="text-xs text-muted truncate hover:text-ivory cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); onArtistClick?.() }}
                    >
                        {artist}
                    </p>
                    {album && (
                        <p
                            className="text-xs text-muted truncate hover:text-ivory cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); onAlbumClick?.() }}
                        >
                            {album}
                        </p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                        <span className="font-mono text-xs text-muted">{formatDuration(duration)}</span>
                        {playCount !== undefined && (
                            <span className="font-mono text-xs text-muted">{playCount} écoutes</span>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); onToggleLike?.() }}
                        aria-label={isLiked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                        <Heart
                            className={clsx('w-4 h-4', isLiked ? 'text-teal fill-current' : 'text-muted')}
                        />
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); onPlay?.() }}
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </Button>
                </div>
            </div>
        </Card>
    )
}