import type { ReactNode } from 'react'
import { Avatar } from '../../../../shared/components/avatar'

interface ArtistHeroProps {
    name: string
    imageUrl?: string
    bio?: string
    children?: ReactNode
}

export function ArtistHero({ name, imageUrl, bio, children }: ArtistHeroProps) {
    return (
        <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-shrink-0">
                <Avatar src={imageUrl} name={name} size="xl" />
            </div>
            <div className="flex-1 flex flex-col gap-2">
                <h1 className="font-display text-3xl md:text-4xl font-semibold text-ivory">{name}</h1>
                <div className="mt-1">{children}</div>
                {bio && <p className="font-body text-base text-muted mt-2">{bio}</p>}
            </div>
        </div>
    )
}