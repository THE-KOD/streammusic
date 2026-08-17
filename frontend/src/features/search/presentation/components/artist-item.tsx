// features/search/presentation/components/artist-item.tsx
import { Avatar } from '../../../../shared/components/avatar'

interface ArtistItemProps {
    name: string
    imageUrl?: string
    onClick?: () => void
}

export function ArtistItem({ name, imageUrl, onClick }: ArtistItemProps) {
    return (
        <div
            onClick={onClick}
            className="flex items-center gap-3 p-3 rounded-xl bg-surface/40 backdrop-blur-sm border border-white/5 hover:bg-surface-raised hover:border-white/10 transition-all duration-200 cursor-pointer"
        >
            <Avatar src={imageUrl} name={name} size="md" />
            <span className="font-display text-ivory text-base truncate">{name}</span>
        </div>
    )
}