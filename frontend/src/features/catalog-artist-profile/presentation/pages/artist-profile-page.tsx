// features/catalog-artist-profile/presentation/pages/artist-profile-page.tsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Pencil, User } from 'lucide-react'
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
        return (
            <EmptyState
                message="Artiste introuvable."
                action={
                    <Button variant="secondary" size="md" onClick={() => navigate('/home')}>
                        Retour à l'accueil
                    </Button>
                }
            />
        )
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
            {/* Barre de navigation supérieure */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-sm font-body text-muted hover:text-ivory transition-all duration-200"
                >
          <span className="p-1.5 rounded-lg bg-surface-raised/50 border border-white/5 group-hover:bg-surface-raised/80 group-hover:border-white/10 transition-all duration-200">
            <ArrowLeft className="w-4 h-4" />
          </span>
                    <span className="hidden sm:inline">Retour</span>
                </button>

                {isOwnProfile && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditOpen(true)}
                        className="gap-2 text-muted hover:text-ivory border border-white/5 hover:border-white/10 bg-surface-raised/30 hover:bg-surface-raised transition-all duration-200"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Modifier mon profil</span>
                        <span className="sm:hidden">Modifier</span>
                    </Button>
                )}
            </div>

            {/* Hero artiste */}
            <ArtistHero
                name={artist.name}
                imageUrl={artist.imageUrl}
                bio={artist.bio}
            >
                {isOwnProfile ? (
                    <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-xs font-medium text-teal">
                            <User className="w-3.5 h-3.5" />
                            Mon profil
                        </div>
                    </div>
                ) : (
                    <FollowButton
                        isFollowing={follow.isFollowing}
                        isLoading={follow.isLoading}
                        error={follow.error}
                        onToggle={follow.toggle}
                        onClearError={follow.clearError}
                    />
                )}
            </ArtistHero>

            {/* Sections */}
            <PopularTracksSection
                tracks={tracks}
                onPlay={(trackId) => {
                    const t = tracks.find((tr) => tr.id === trackId)
                    if (t) playTrack(t, tracks)
                }}
                onToggleLike={toggleLike}
                likedTrackIds={likedTrackIds}
                playingTrackId={isPlaying ? currentTrack?.id : undefined}
            />

            <AlbumsSection
                albums={albums}
                onAlbumClick={(albumId) => navigate(`/albums/${albumId}`)}
            />

            {/* Modal d'édition */}
            {isOwnProfile && (
                <EditArtistProfileModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    initialBio={artist.bio}
                    onSave={handleSaveProfile}
                />
            )}
        </div>
    )
}