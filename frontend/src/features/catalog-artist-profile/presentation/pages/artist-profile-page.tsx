import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArtistHero } from '../components/artist-hero'
import { FollowButton } from '../components/follow-button'
import { PopularTracksSection } from '../components/popular-tracks-section'
import { AlbumsSection } from '../components/albums-section'
import { LoadingState, EmptyState } from '../../../../shared/components/states'
import { useArtistProfile } from '../hooks/use-artist-profile'
import { useFollowArtist } from '../../../follows'
import {useLikedTrackIds} from "../../../favorites";

export function ArtistProfilePage() {
  const { artistId } = useParams()
  const navigate = useNavigate()
  const { artist, tracks, albums, isLoading } = useArtistProfile(artistId)
  const follow = useFollowArtist(artistId ?? '', false)

  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null)
    const { likedTrackIds, toggleLike } = useLikedTrackIds()

  if (isLoading) return <LoadingState />
  if (!artist) {
    return <EmptyState message="Artiste introuvable." action={<button onClick={() => navigate('/home')} className="text-teal hover:underline">Retour</button>} />
  }

  return (
      <>
        <ArtistHero name={artist.name} imageUrl={artist.imageUrl} bio={artist.bio}>
          <FollowButton
              isFollowing={follow.isFollowing}
              isLoading={follow.isLoading}
              error={follow.error}
              onToggle={follow.toggle}
              onClearError={follow.clearError}
          />
        </ArtistHero>

        <PopularTracksSection
            tracks={tracks}
            onPlay={setPlayingTrackId}
            onToggleLike={toggleLike}
            likedTrackIds={likedTrackIds}
            playingTrackId={playingTrackId ?? undefined}
        />

        <AlbumsSection albums={albums} onAlbumClick={(albumId) => navigate(`/albums/${albumId}`)} />
      </>
  )
}