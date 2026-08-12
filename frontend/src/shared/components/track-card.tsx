import { Play, Pause, Heart } from 'lucide-react'
import clsx from 'clsx'
import { Card } from './card'
import { Button } from './button'
import { formatDuration } from '../utils/format-duration'
import type { Track } from '../types/track'

interface TrackCardProps extends Track {
    isPlaying?: boolean
    isLiked?: boolean
    onPlay?: () => void
    onToggleLike?: () => void
    onArtistClick?: () => void
    onAlbumClick?: () => void
}

export function TrackCard({
                              title, artistName, albumTitle, duration, coverUrl, playCount,
                              isPlaying = false, isLiked = false, onPlay, onToggleLike, onArtistClick, onAlbumClick,
                          }: TrackCardProps) {
    return (
        <Card onClick={onPlay} className="group cursor-pointer">
            <div className="flex flex-col gap-2">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-raised">
                    {coverUrl ? <img src={coverUrl} alt={title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-surface-raised" />}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-ink/40">
                        {isPlaying ? <Pause className="w-8 h-8 text-ivory" /> : <Play className="w-8 h-8 text-ivory" fill="currentColor" />}
                    </div>
                </div>
                <div className="flex flex-col min-w-0">
                    <p className="font-display text-sm font-medium text-ivory truncate">{title}</p>
                    <p className="text-xs text-muted truncate hover:text-ivory cursor-pointer" onClick={(e) => { e.stopPropagation(); onArtistClick?.() }}>{artistName}</p>
                    {albumTitle && <p className="text-xs text-muted truncate hover:text-ivory cursor-pointer" onClick={(e) => { e.stopPropagation(); onAlbumClick?.() }}>{albumTitle}</p>}
                    <div className="flex items-center justify-between mt-1">
                        <span className="font-mono text-xs text-muted">{formatDuration(duration)}</span>
                        {playCount !== undefined && <span className="font-mono text-xs text-muted">{playCount} écoutes</span>}
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onToggleLike?.() }} aria-label={isLiked ? 'Retirer des favoris' : 'Ajouter aux favoris'} className="self-end -mt-1">
                    <Heart className={clsx('w-4 h-4', isLiked ? 'text-teal fill-current' : 'text-muted')} />
                </Button>
            </div>
        </Card>
    )
}