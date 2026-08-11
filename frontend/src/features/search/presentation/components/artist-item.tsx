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
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface cursor-pointer transition-colors"
        >
            <Avatar src={imageUrl} name={name} size="md" />
            <span className="font-display text-ivory">{name}</span>
        </div>
    )
}