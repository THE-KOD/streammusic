import { Card } from './card'
import type { Album } from '../types/album'

interface AlbumCardProps extends Album {
    showArtist?: boolean
    onClick?: () => void
}

export function AlbumCard({ title, artistName, releaseDate, coverUrl, showArtist = true, onClick }: AlbumCardProps) {
    return (
        <Card onClick={onClick} className="cursor-pointer">
            <div className="flex flex-col gap-2">
                <div className="aspect-square overflow-hidden rounded-lg bg-surface-raised">
                    {coverUrl ? (
                        <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-surface-raised" />
                    )}
                </div>
                <p className="font-display text-sm font-medium text-ivory truncate">{title}</p>
                {showArtist && artistName && <p className="text-xs text-muted truncate">{artistName}</p>}
                <p className="font-mono text-xs text-muted">{releaseDate}</p>
            </div>
        </Card>
    )
}