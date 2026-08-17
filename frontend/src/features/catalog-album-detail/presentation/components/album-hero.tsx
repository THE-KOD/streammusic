// features/catalog-album-detail/presentation/components/album-hero.tsx
import { formatDuration } from '../../../../shared/utils/format-duration'

interface AlbumHeroProps {
    title: string
    artistName: string
    releaseDate: string
    totalDuration: number
    coverUrl?: string
    onArtistClick?: () => void
}

export function AlbumHero({ title, artistName, releaseDate, totalDuration, coverUrl, onArtistClick }: AlbumHeroProps) {
    return (
        <div className="relative mb-8 p-6 rounded-xl bg-gradient-to-br from-surface to-surface-raised border border-white/5 overflow-hidden">
            {/* Bulles décoratives */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber/10 rounded-full blur-3xl" />
            <div className="absolute -left-8 -bottom-8 w-48 h-48 bg-teal/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 w-48 h-48 md:w-56 md:h-56 rounded-xl overflow-hidden bg-surface-raised shadow-lg">
                    {coverUrl ? (
                        <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted">No cover</div>
                    )}
                </div>
                <div className="flex-1 flex flex-col justify-center gap-1">
                    <h1 className="font-display text-3xl md:text-4xl font-semibold text-ivory">{title}</h1>
                    <p
                        className={`font-body text-base text-teal ${onArtistClick ? 'cursor-pointer hover:underline' : ''}`}
                        onClick={onArtistClick}
                    >
                        {artistName}
                    </p>
                    <p className="font-body text-sm text-muted">Date de sortie : {releaseDate}</p>
                    <p className="font-mono text-sm text-muted">Durée totale : {formatDuration(totalDuration)}</p>
                </div>
            </div>
        </div>
    )
}