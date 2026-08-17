// features/catalog-artist-profile/presentation/components/artist-hero.tsx
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
        <div className="relative mb-8 p-6 rounded-xl bg-gradient-to-br from-surface to-surface-raised border border-white/5 overflow-hidden">
            {/* Bulles décoratives */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-teal/10 rounded-full blur-3xl" />
            <div className="absolute -left-8 -bottom-8 w-48 h-48 bg-amber/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                    <Avatar src={imageUrl} name={name} size="xl" />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                    <h1 className="font-display text-3xl md:text-4xl font-semibold text-ivory">{name}</h1>
                    <div className="mt-1">{children}</div>
                    {bio && <p className="font-body text-base text-muted mt-2 max-w-2xl">{bio}</p>}
                </div>
            </div>
        </div>
    )
}