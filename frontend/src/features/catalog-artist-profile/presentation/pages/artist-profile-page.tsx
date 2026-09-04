// features/catalog-artist-profile/presentation/pages/artist-profile-page.tsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Pencil } from 'lucide-react'
import { Button } from '../../../../shared/components/button'
import { ArtistHero } from '../components/artist-hero'
import { FollowButton } from '../components/follow-button'
import { PopularTracksSection } from '../components/popular-tracks-section'
import { AlbumsSection } from '../components/albums-section'
import { EditArtistProfileModal } from '../components/edit-artist-profile-modal'
import { LoadingState, EmptyState } from '../../../../shared/components/states'
import { useArtistProfile } from '../hooks/use-artist-profile'
import { useFollowArtist } from '../../../follows'
import { useLikedTrackIds } from '../../../favorites'
import { usePlayerStore, useCurrentTrack } from '../../../player/presentation/store/player-store'
import { useAuthStore } from '../../../../core/store/auth-store'
import { artistProfileService } from '../../data/artist-profile.service'
import { useToastStore } from '../../../../core/store/toast-store'

export function ArtistProfilePage() {
    const { artistId } = useParams()
    const navigate = useNavigate()
    const { artist, tracks, albums, isLoading, reload } = useArtistProfile(artistId)
    const follow = useFollowArtist(artistId ?? '', false)
    const currentUserId = useAuthStore((state) => state.user?.id)
    const showToast = useToastStore((state) => state.showToast)

    const playTrack = usePlayerStore((state) => state.playTrack)
    const isPlaying = usePlayerStore((state) => state.isPlaying)
    const currentTrack = useCurrentTrack()
    const { likedTrackIds, toggleLike } = useLikedTrackIds()
    const [isEditOpen, setIsEditOpen] = useState(false)

    if (isLoading) return <LoadingState />
    if (!artist) {
        return <EmptyState message="Artiste introuvable." action={<button onClick={() => navigate('/home')} className="text-teal hover:underline">Retour</button>} />
    }

    const isOwnProfile = currentUserId === artistId

    const handleSaveProfile = async (bio: string, photoFile: File | null) => {
        if (!artistId) return
        await artistProfileService.updateMyProfile(artistId, bio, photoFile)
        showToast('Profil mis à jour', 'success')
        reload()
    }

    return (
        <div className="space-y-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted hover:text-ivory transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Retour
            </button>

            <ArtistHero name={artist.name} imageUrl={artist.imageUrl} bio={artist.bio}>
                {isOwnProfile ? (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)} className="gap-1.5">
                        <Pencil className="w-3.5 h-3.5" />
                        Modifier mon profil
                    </Button>
                ) : (
                    <FollowButton isFollowing={follow.isFollowing} isLoading={follow.isLoading} error={follow.error} onToggle={follow.toggle} onClearError={follow.clearError} />
                )}
            </ArtistHero>

            <PopularTracksSection
                tracks={tracks}
                // Corrige la lecture cassée (point 5-3) : appelait auparavant
                // uniquement setPlayingTrackId (état purement visuel), jamais
                // playTrack() du store — donc rien ne jouait réellement.
                onPlay={(trackId) => { const t = tracks.find((tr) => tr.id === trackId); if (t) playTrack(t, tracks) }}
                onToggleLike={toggleLike}
                likedTrackIds={likedTrackIds}
                playingTrackId={isPlaying ? currentTrack?.id : undefined}
            />

            <AlbumsSection albums={albums} onAlbumClick={(albumId) => navigate(`/albums/${albumId}`)} />

            {isOwnProfile && (
                <EditArtistProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} initialBio={artist.bio} onSave={handleSaveProfile} />
            )}
        </div>
    )
}