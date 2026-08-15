import { useState } from 'react'
import { useNavigate } from 'react-router'
import clsx from 'clsx'
import { LoadingState, EmptyState, ErrorState } from '../../../../shared/components/states'
import { LikedTrackRow } from '../components/liked-track-row'
import { FollowedArtistRow } from '../components/followed-artist-row'
import { SavedAlbumCard } from '../components/saved-album-card'
import { useLikedTracks, useSavedAlbums } from '../../../favorites'
import { useFollowedArtists } from '../../../follows'
import { usePlayerStore } from '../../../player/presentation/store/player-store'

type LibraryTab = 'tracks' | 'artists' | 'albums'

const TABS: { key: LibraryTab; label: string }[] = [
  { key: 'tracks', label: 'Titres likés' },
  { key: 'artists', label: 'Artistes suivis' },
  { key: 'albums', label: 'Albums sauvegardés' },
]

export function LibraryPage() {
  const [tab, setTab] = useState<LibraryTab>('tracks')
  const navigate = useNavigate()
  const playTrack = usePlayerStore((state) => state.playTrack)

  const liked = useLikedTracks()
  const followed = useFollowedArtists()
  const saved = useSavedAlbums()

  return (
      <div>
        <h1 className="font-display text-4xl font-semibold text-ivory mb-6">Bibliothèque</h1>

        <div className="flex gap-2 mb-6 border-b border-white/10">
          {TABS.map((t) => (
              <button
                  key={t.key} onClick={() => setTab(t.key)}
                  className={clsx('px-4 py-2 text-sm font-body border-b-2 -mb-px transition-colors', tab === t.key ? 'border-amber text-ivory' : 'border-transparent text-muted hover:text-ivory')}
              >
                {t.label}
              </button>
          ))}
        </div>

        {tab === 'tracks' && (
            liked.isLoading ? <LoadingState /> :
                liked.error ? <ErrorState message={liked.error} /> :
                    liked.tracks.length === 0 ? <EmptyState title="Aucun titre liké" message="Les titres que vous aimez apparaîtront ici." /> :
                        <div className="space-y-1">
                          {liked.tracks.map((track) => <LikedTrackRow key={track.id} track={track} onPlay={() => playTrack(track, liked.tracks)} onRemove={() => liked.removeLike(track.id)} />)}
                        </div>
        )}

        {tab === 'artists' && (
            followed.isLoading ? <LoadingState /> :
                followed.artists.length === 0 ? <EmptyState title="Aucun artiste suivi" message="Les artistes que vous suivez apparaîtront ici." /> :
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {followed.artists.map((artist) => <FollowedArtistRow key={artist.id} artist={artist} onClick={() => navigate(`/artists/${artist.id}`)} />)}
                    </div>
        )}

        {tab === 'albums' && (
            saved.isLoading ? <LoadingState /> :
                saved.error ? <ErrorState message={saved.error} /> :
                    saved.albums.length === 0 ? <EmptyState title="Aucun album sauvegardé" message="Les albums que vous sauvegardez apparaîtront ici." /> :
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {saved.albums.map((album) => <SavedAlbumCard key={album.id} album={album} onClick={() => navigate(`/albums/${album.id}`)} onUnsave={() => saved.unsave(album.id)} />)}
                        </div>
        )}
      </div>
  )
}