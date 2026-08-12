import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { AlbumHero } from '../components/album-hero'
import { AlbumActions } from '../components/album-actions'
import { TrackRow } from '../../../../shared/components/track-row'
import { LoadingState, EmptyState } from '../../../../shared/components/states'
import { SectionHeader } from '../../../home/presentation/components/section-header'
import { useAlbumDetail } from '../hooks/use-album-detail'

export function AlbumDetailPage() {
  const { albumId } = useParams()
  const navigate = useNavigate()
  const { album, tracks, isLoading } = useAlbumDetail(albumId)
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null)

  if (isLoading) return <LoadingState />
  if (!album) {
    return <EmptyState message="Album introuvable." action={<button onClick={() => navigate('/home')} className="text-teal hover:underline">Retour</button>} />
  }

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

        <AlbumActions trackCount={tracks.length} onPlayAll={() => tracks.length > 0 && setPlayingTrackId(tracks[0].id)} />

        <section>
          <SectionHeader title="Titres" />
          {tracks.length === 0 ? (
              <EmptyState message="Cet album ne contient aucun titre disponible." />
          ) : (
              <div className="space-y-1">
                {tracks.map((track, index) => (
                    <TrackRow
                        key={track.id}
                        index={index + 1}
                        title={track.title}
                        artistName={album.artistName ?? ''}
                        duration={track.duration}
                        showCover={false}
                        showArtist={false}
                        isPlaying={playingTrackId === track.id}
                        onPlay={() => setPlayingTrackId(track.id)}
                    />
                ))}
              </div>
          )}
        </section>
      </>
  )
}