import { LoadingState, EmptyState, ErrorState } from '../../../../shared/components/states'
import { LikedTrackRow } from '../components/liked-track-row'
import { useLibrary } from '../hooks/use-library'
import { usePlayerStore } from '../../../player/presentation/store/player-store'
import type {Track} from "../../../../shared/types/track.ts";

export function LibraryPage() {
  const { tracks, isLoading, error, removeLike } = useLibrary()
  const setCurrentTrack = usePlayerStore((state) => state.setCurrentTrack)

  const handlePlay = (track: Track) => {
    const storeTrack = {
      id: track.id,
      title: track.title,
      artist: track.artistName,
      album: track.albumTitle,
      duration: track.duration,
      coverUrl: track.coverUrl,
      fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    }
    setCurrentTrack(storeTrack)
  }

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />

  return (
      <div>
        <h1 className="font-display text-4xl font-semibold text-ivory mb-6">Bibliothèque</h1>
        <h2 className="font-display text-2xl font-semibold text-ivory mb-4">Titres likés</h2>

        {tracks.length === 0 ? (
            <EmptyState
                title="Aucun titre liké"
                message="Les titres que vous aimez apparaîtront ici."
            />
        ) : (
            <div className="space-y-1">
              {tracks.map((track) => (
                  <LikedTrackRow
                      key={track.id}
                      track={track}
                      onPlay={() => handlePlay(track)}
                      onRemove={() => removeLike(track.id)}
                  />
              ))}
            </div>
        )}
      </div>
  )
}