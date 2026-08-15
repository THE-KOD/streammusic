import { Avatar } from '../../../../shared/components/avatar'
import type { FollowedArtist } from '../../../follows'

interface FollowedArtistRowProps {
    artist: FollowedArtist
    onClick: () => void
}

export function FollowedArtistRow({ artist, onClick }: FollowedArtistRowProps) {
    return (
        <div onClick={onClick} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface cursor-pointer transition-colors">
            <Avatar src={artist.imageUrl} name={artist.name} size="md" />
            <span className="font-display text-ivory">{artist.name}</span>
        </div>
    )
}