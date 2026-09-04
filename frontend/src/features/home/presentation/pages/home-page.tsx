// features/home/presentation/pages/home-page.tsx
import { Greeting } from '../components/greeting'
import { SectionHeader } from '../components/section-header'
import { TrackCard } from '../../../../shared/components/track-card'
import { LoadingState, EmptyState, ErrorState } from '../../../../shared/components/states'
import { useHomeSections } from '../hooks/use-home-sections'
import { usePlayerStore, useCurrentTrack } from '../../../player/presentation/store/player-store'
import type { Track } from '../../../../shared/types/track'
import { dedupeById } from '../../../../shared/utils/dedupe-by-id'
import { useAuthStore } from '../../../../core/store/auth-store'

// ── TrackGrid (remplace uniquement cette fonction) ──
function TrackGrid({ tracks }: { tracks: Track[] }) {
    const playTrack = usePlayerStore((state) => state.playTrack)
    const currentTrack = useCurrentTrack()
    const isPlaying = usePlayerStore((state) => state.isPlaying)
    const uniqueTracks = dedupeById(tracks)

    return (
        <div
            className="flex gap-4 overflow-x-auto overflow-y-hidden pb-2 -mx-1 px-1 snap-x snap-proximity
                       [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent
                       [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full
                       hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
        >
            {uniqueTracks.map((track) => (
                <div key={track.id} className="w-40 sm:w-44 flex-shrink-0 snap-start">
                    <TrackCard
                        {...track}
                        isPlaying={isPlaying && currentTrack?.id === track.id}
                        onPlay={() => playTrack(track, uniqueTracks)}
                    />
                </div>
            ))}
        </div>
    )
}

// ── Composant Section interne (pour éviter la duplication) ──
function Section({
                     title,
                     subtitle,
                     seeMoreLink,
                     state,
                     children,
                 }: {
    title: string
    subtitle?: string
    seeMoreLink?: string
    state: { isLoading: boolean; error: string | null; data: Track[] }
    children: React.ReactNode
}) {
    const { isLoading, error, data } = state

    return (
        <section className="bg-surface/40 backdrop-blur-sm rounded-xl p-4 border border-white/5 animate-fade-in">
            <SectionHeader title={title} subtitle={subtitle} seeMoreLink={seeMoreLink} />

            {isLoading && <LoadingState />}
            {error && <ErrorState message={error} />}
            {!isLoading && !error && data.length === 0 && (
                <EmptyState message="Aucun élément à afficher pour le moment." />
            )}
            {!isLoading && !error && data.length > 0 && children}
        </section>
    )
}

// ── Page principale ──
export function HomePage() {
    const { popular, newReleases, recommendations } = useHomeSections()
    const pseudo = useAuthStore((state) => state.user?.pseudo) ?? 'Utilisateur'

    return (
        <div className="space-y-8">
            <Greeting pseudo={pseudo} />

            <Section title="Titres populaires" state={popular}>
                <TrackGrid tracks={popular.data} />
            </Section>

            <Section title="Nouveautés" state={newReleases}>
                <TrackGrid tracks={newReleases.data} />
            </Section>

            <Section
                title="Pour vous"
                subtitle="Basé sur votre activité d'écoute"
                state={recommendations}
            >
                <TrackGrid tracks={recommendations.data} />
            </Section>
        </div>
    )
}