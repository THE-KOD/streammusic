import { Avatar } from '../../../../shared/components/avatar'
import type { FollowedArtist } from '../../../follows'

interface FollowedArtistCardProps {
    artist: FollowedArtist
    onClick: () => void
}

export function FollowedArtistCard({ artist, onClick }: FollowedArtistCardProps) {
    return (
        <div
            onClick={onClick}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface hover:bg-surface-raised transition-all duration-200 cursor-pointer group border border-transparent hover:border-white/10"
        >
            <Avatar src={artist.imageUrl} name={artist.name} size="lg" />
            <span className="font-display text-sm text-ivory text-center group-hover:text-amber transition-colors">
        {artist.name}
      </span>
        </div>
    )
}