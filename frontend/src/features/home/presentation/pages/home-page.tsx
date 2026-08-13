import { Greeting } from '../components/greeting'
import { SectionHeader } from '../components/section-header'
import { TrackCard } from '../../../../shared/components/track-card'
import { LoadingState, EmptyState, ErrorState } from '../../../../shared/components/states'
import { useHomeSections } from '../hooks/use-home-sections'
import { usePlayerStore, useCurrentTrack } from '../../../player/presentation/store/player-store'
import type { Track } from '../../../../shared/types/track'

function TrackGrid({ tracks }: { tracks: Track[] }) {
    const playTrack = usePlayerStore((state) => state.playTrack)
    const currentTrack = useCurrentTrack()
    const isPlaying = usePlayerStore((state) => state.isPlaying)

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {tracks.map((track) => (
                <TrackCard
                    key={track.id}
                    {...track}
                    isPlaying={isPlaying && currentTrack?.id === track.id}
                    onPlay={() => playTrack(track, tracks)}
                />
            ))}
        </div>
    )
}

export function HomePage() {
    const { popular, newReleases, recommendations } = useHomeSections()

    return (
        <>
            <Greeting pseudo="Utilisateur" />
            <section className="mb-8">
                <SectionHeader title="Titres populaires" />
                {popular.isLoading && <LoadingState />}
                {popular.error && <ErrorState message={popular.error} />}
                {!popular.isLoading && !popular.error && popular.data.length === 0 && <EmptyState message="Aucun titre populaire pour le moment." />}
                {!popular.isLoading && !popular.error && popular.data.length > 0 && <TrackGrid tracks={popular.data} />}
            </section>
            <section className="mb-8">
                <SectionHeader title="Nouveautés" />
                {newReleases.isLoading && <LoadingState />}
                {newReleases.error && <ErrorState message={newReleases.error} />}
                {!newReleases.isLoading && !newReleases.error && newReleases.data.length === 0 && <EmptyState message="Aucune nouveauté pour le moment." />}
                {!newReleases.isLoading && !newReleases.error && newReleases.data.length > 0 && <TrackGrid tracks={newReleases.data} />}
            </section>
            <section className="mb-8">
                <SectionHeader title="Pour vous" subtitle="Basé sur votre activité d'écoute" />
                {recommendations.isLoading && <LoadingState />}
                {recommendations.error && <ErrorState message={recommendations.error} />}
                {!recommendations.isLoading && !recommendations.error && recommendations.data.length === 0 && <EmptyState message="Nous n'avons pas encore assez d'écoute pour personnaliser vos recommandations." />}
                {!recommendations.isLoading && !recommendations.error && recommendations.data.length > 0 && <TrackGrid tracks={recommendations.data} />}
            </section>
        </>
    )
}