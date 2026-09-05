// features/catalog-album-detail/presentation/pages/album-detail-page.tsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Image } from 'lucide-react'
import { Button } from '../../../../shared/components/button'
import { AlbumHero } from '../components/album-hero'
import { AlbumActions } from '../components/album-actions'
import { EditAlbumCoverModal } from '../components/edit-album-cover-modal'
import { TrackRow } from '../../../../shared/components/track-row'
import { LoadingState, EmptyState } from '../../../../shared/components/states'
import { SectionHeader } from '../../../home/presentation/components/section-header'
import { useAlbumDetail } from '../hooks/use-album-detail'
import { albumDetailService } from '../../data/album-detail.service'
import { useAlbumSave, useLikedTrackIds } from '../../../favorites'
import { usePlayerStore, useCurrentTrack } from '../../../player/presentation/store/player-store'
import { useAuthStore } from '../../../../core/store/auth-store'
import { useToastStore } from '../../../../core/store/toast-store'
import type { AlbumTrack } from '../../domain/album-detail.entity'
import type { Track } from '../../../../shared/types/track'

export function AlbumDetailPage() {
    const { albumId } = useParams()
    const navigate = useNavigate()
    const { album, tracks, isLoading, reload } = useAlbumDetail(albumId)
    const { isSaved, toggle } = useAlbumSave(albumId ?? '')
    const { likedTrackIds, toggleLike } = useLikedTrackIds()
    const playTrack = usePlayerStore((state) => state.playTrack)
    const isPlaying = usePlayerStore((state) => state.isPlaying)
    const currentTrack = useCurrentTrack()
    const currentUserId = useAuthStore((state) => state.user?.id)
    const showToast = useToastStore((state) => state.showToast)
    const [isEditCoverOpen, setIsEditCoverOpen] = useState(false)

    if (isLoading) return <LoadingState />
    if (!album) {
        return (
            <EmptyState
                message="Album introuvable."
                action={
                    <Button variant="secondary" size="md" onClick={() => navigate('/home')}>
                        Retour à l'accueil
                    </Button>
                }
            />
        )
    }

    const isOwner = currentUserId === album.artistId

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

    const handleUpdateCover = async (coverFile: File) => {
        if (!albumId) return
        await albumDetailService.updateCover(albumId, coverFile)
        showToast('Pochette mise à jour', 'success')
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

                {isOwner && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditCoverOpen(true)}
                        className="gap-2 text-muted hover:text-ivory border border-white/5 hover:border-white/10 bg-surface-raised/30 hover:bg-surface-raised transition-all duration-200"
                    >
                        <Image className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Modifier la pochette</span>
                        <span className="sm:hidden">Pochette</span>
                    </Button>
                )}
            </div>

            {/* Hero album */}
            <div className="relative">
                <AlbumHero
                    title={album.title}
                    artistName={album.artistName ?? 'Artiste inconnu'}
                    releaseDate={album.releaseDate}
                    totalDuration={album.totalDuration}
                    coverUrl={album.coverUrl}
                    onArtistClick={album.artistId ? () => navigate(`/artists/${album.artistId}`) : undefined}
                />

                {isOwner && (
                    <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber/10 border border-amber/20 text-xs font-medium text-amber">
              <span className="w-1.5 h-1.5 rounded-full bg-amber" />
              Propriétaire
            </span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <AlbumActions
                trackCount={tracks.length}
                onPlayAll={() => playableQueue.length > 0 && playTrack(playableQueue[0], playableQueue)}
                isSaved={isSaved}
                onToggleSave={toggle}
            />

            {/* Liste des titres */}
            <section className="bg-surface/40 backdrop-blur-sm rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all duration-200">
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
                                isPlaying={isPlaying && currentTrack?.id === track.id}
                                isLiked={likedTrackIds.includes(track.id)}
                                onToggleLike={() => toggleLike(track.id)}
                                onPlay={() => playTrack(toPlayableTrack(track), playableQueue)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Modal d'édition */}
            {isOwner && (
                <EditAlbumCoverModal
                    isOpen={isEditCoverOpen}
                    onClose={() => setIsEditCoverOpen(false)}
                    onSave={handleUpdateCover}
                />
            )}
        </div>
    )
}