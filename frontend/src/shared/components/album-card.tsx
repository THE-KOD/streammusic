import { Bookmark } from 'lucide-react'
import clsx from 'clsx'
import { Card } from './card'
import type { Album } from '../types/album'

interface AlbumCardProps extends Album {
    showArtist?: boolean
    isSaved?: boolean
    onToggleSave?: () => void
    onClick?: () => void
}

export function AlbumCard({ title, artistName, releaseDate, coverUrl, showArtist = true, isSaved, onToggleSave, onClick }: AlbumCardProps) {
    return (
        <Card onClick={onClick} className="cursor-pointer group relative">
            <div className="flex flex-col gap-2">
                <div className="aspect-square overflow-hidden rounded-lg bg-surface-raised">
                    {coverUrl ? <img src={coverUrl} alt={title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-surface-raised" />}
                </div>
                <p className="font-display text-sm font-medium text-ivory truncate">{title}</p>
                {showArtist && artistName && <p className="text-xs text-muted truncate">{artistName}</p>}
                <p className="font-mono text-xs text-muted">{releaseDate}</p>
            </div>
            {onToggleSave && (
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleSave() }}
                    aria-label={isSaved ? 'Retirer des albums sauvegardés' : 'Sauvegarder cet album'}
                    className={clsx('absolute top-2 right-2 p-1.5 rounded-full bg-ink/60 backdrop-blur-sm transition-opacity', isSaved ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')}
                >
                    <Bookmark className={clsx('w-4 h-4', isSaved ? 'text-teal' : 'text-ivory')} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
            )}
        </Card>
    )
}