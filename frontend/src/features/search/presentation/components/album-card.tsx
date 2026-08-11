import { Card } from '../../../../shared/components/card'

interface AlbumCardProps {
    title: string
    artist: string
    releaseDate: string
    coverUrl?: string
    onClick?: () => void
}

export function AlbumCard({ title, artist, releaseDate, coverUrl, onClick }: AlbumCardProps) {
    return (
        <Card className="cursor-pointer hover:bg-surface-raised transition-colors" onClick={onClick}>
            <div className="flex gap-3 items-center">
                <div className="w-16 h-16 rounded-md overflow-hidden bg-surface-raised flex-shrink-0">
                    {coverUrl ? (
                        <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-surface-raised" />
                    )}
                </div>
                <div className="min-w-0">
                    <p className="font-display text-sm text-ivory truncate">{title}</p>
                    <p className="text-xs text-muted">{artist}</p>
                    <p className="font-mono text-xs text-muted">{releaseDate}</p>
                </div>
            </div>
        </Card>
    )
}