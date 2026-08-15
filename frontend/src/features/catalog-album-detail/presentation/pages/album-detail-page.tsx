import { useParams, useNavigate } from 'react-router'
import { AlbumHero } from '../components/album-hero'
import { AlbumActions } from '../components/album-actions'
import { TrackRow } from '../../../../shared/components/track-row'
import { LoadingState, EmptyState } from '../../../../shared/components/states'
import { SectionHeader } from '../../../home/presentation/components/section-header'
import { useAlbumDetail } from '../hooks/use-album-detail'
import { useAlbumSave } from '../../../favorites'
import { usePlayerStore, useCurrentTrack } from '../../../player/presentation/store/player-store'
import type { AlbumTrack } from '../../domain/album-detail.entity'
import type { Track } from '../../../../shared/types/track'

export function AlbumDetailPage() {
    const { albumId } = useParams()
    const navigate = useNavigate()
    const { album, tracks, isLoading } = useAlbumDetail(albumId)
    const { isSaved, toggle } = useAlbumSave(albumId ?? '')
    const playTrack = usePlayerStore((state) => state.playTrack)
    const isPlaying = usePlayerStore((state) => state.isPlaying)
    const currentTrack = useCurrentTrack()

    if (isLoading) return <LoadingState />
    if (!album) {
        return <EmptyState message="Album introuvable." action={<button onClick={() => navigate('/home')} className="text-teal hover:underline">Retour</button>} />
    }

    const toPlayableTrack = (t: AlbumTrack): Track => ({
        id: t.id,
        title: t.title,
        artistName: album.artistName ?? 'Artiste inconnu',
        artistId: album.artistId ?? '',
        albumTitle: album.title,
        albumId: album.id,
        duration: t.duration,
        coverUrl: album.coverUrl,
        fileUrl: t.fileUrl,
    })

    const playableQueue = tracks.map(toPlayableTrack)

    return (
        <>
            <AlbumHero
                title={album.title}
                artistName={album.artistName ?? 'Artiste inconnu'}
                releaseDate={album.releaseDate}
                totalDuration={album.totalDuration}
                coverUrl={album.coverUrl}
                onArtistClick={album.artistId ? () => navigate(`/artists/${album.artistId}`) : undefined}
            />

            <AlbumActions trackCount={tracks.length} onPlayAll={() => playableQueue.length > 0 && playTrack(playableQueue[0], playableQueue)} isSaved={isSaved} onToggleSave={toggle} />

            <section>
                <SectionHeader title="Titres" />
                {tracks.length === 0 ? (
                    <EmptyState message="Cet album ne contient aucun titre disponible." />
                ) : (
                    <div className="space-y-1">
                        {tracks.map((track, index) => (
                            <TrackRow
                                key={track.id} index={index + 1} title={track.title} artistName={album.artistName ?? ''}
                                duration={track.duration} showCover={false} showArtist={false}
                                isPlaying={isPlaying && currentTrack?.id === track.id}
                                onPlay={() => playTrack(toPlayableTrack(track), playableQueue)}
                            />
                        ))}
                    </div>
                )}
            </section>
        </>
    )
}