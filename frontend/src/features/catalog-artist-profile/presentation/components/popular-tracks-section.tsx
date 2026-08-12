import { SectionHeader } from '../../../home/presentation/components/section-header'
import { TrackRow } from '../../../../shared/components/track-row'
import { EmptyState } from '../../../../shared/components/states'
import type { Track } from '../../../../shared/types/track'

interface PopularTracksSectionProps {
    tracks: Track[]
    onPlay?: (trackId: string) => void
    onToggleLike?: (trackId: string) => void
    likedTrackIds?: string[]
    playingTrackId?: string
}

export function PopularTracksSection({ tracks, onPlay, onToggleLike, likedTrackIds = [], playingTrackId }: PopularTracksSectionProps) {
    if (tracks.length === 0) {
        return <section className="mb-8"><SectionHeader title="Titres populaires" /><EmptyState message="Aucun titre populaire disponible." /></section>
    }
    return (
        <section className="mb-8">
            <SectionHeader title="Titres populaires" />
            <div className="space-y-1">
                {tracks.map((track, index) => (
                    <TrackRow
                        key={track.id}
                        index={index + 1}
                        title={track.title}
                        artistName={track.artistName}
                        albumTitle={track.albumTitle}
                        duration={track.duration}
                        coverUrl={track.coverUrl}
                        showArtist={false}
                        isPlaying={playingTrackId === track.id}
                        isLiked={likedTrackIds.includes(track.id)}
                        onPlay={() => onPlay?.(track.id)}
                        onToggleLike={() => onToggleLike?.(track.id)}
                    />
                ))}
            </div>
        </section>
    )
}