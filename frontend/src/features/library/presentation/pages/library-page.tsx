import { useState } from 'react'
import { useNavigate } from 'react-router'
import clsx from 'clsx'
import { Heart, Users, Album } from 'lucide-react'
import { LoadingState, EmptyState, ErrorState } from '../../../../shared/components/states'
import { LikedTrackRow } from '../components/liked-track-row'
import { FollowedArtistCard } from '../components/followed-artist-card'
import { SavedAlbumCard } from '../components/saved-album-card'
import { useLikedTracks, useSavedAlbums } from '../../../favorites'
import { useFollowedArtists } from '../../../follows'
import { usePlayerStore } from '../../../player/presentation/store/player-store'

type LibraryTab = 'tracks' | 'artists' | 'albums'

const TABS: { key: LibraryTab; label: string; icon: typeof Heart }[] = [
    { key: 'tracks', label: 'Titres likés', icon: Heart },
    { key: 'artists', label: 'Artistes suivis', icon: Users },
    { key: 'albums', label: 'Albums sauvegardés', icon: Album },
]

export function LibraryPage() {
    const [tab, setTab] = useState<LibraryTab>('tracks')
    const navigate = useNavigate()
    const playTrack = usePlayerStore((state) => state.playTrack)

    const liked = useLikedTracks()
    const followed = useFollowedArtists()
    const saved = useSavedAlbums()

    return (
        <div className="space-y-8">
            {/* En-tête avec déco */}
            <div className="relative p-6 rounded-xl bg-gradient-to-br from-surface to-surface-raised border border-white/5 overflow-hidden">
                <div className="absolute -right-12 -top-12 w-40 h-40 bg-amber/10 rounded-full blur-2xl" />
                <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-teal/10 rounded-full blur-2xl" />
                <div className="relative">
                    <h1 className="font-display text-3xl md:text-4xl font-semibold text-ivory">
                        Bibliothèque
                    </h1>
                    <p className="text-muted text-sm mt-1">
                        Retrouvez vos favoris en un clin d'œil
                    </p>
                </div>
            </div>

            {/* Onglets avec icônes */}
            <div className="flex gap-1 border-b border-white/10">
                {TABS.map((t) => {
                    const isActive = tab === t.key
                    const Icon = t.icon
                    return (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={clsx(
                                'flex items-center gap-2 px-4 py-2.5 text-sm font-body border-b-2 -mb-px transition-all duration-200',
                                isActive
                                    ? 'border-amber text-ivory'
                                    : 'border-transparent text-muted hover:text-ivory hover:border-white/10'
                            )}
                        >
                            <Icon className={clsx('w-4 h-4', isActive ? 'text-amber' : 'text-muted')} />
                            {t.label}
                        </button>
                    )
                })}
            </div>

            {/* Contenu des onglets */}
            <div className="animate-fade-in">
                {tab === 'tracks' && (
                    liked.isLoading ? <LoadingState /> :
                        liked.error ? <ErrorState message={liked.error} /> :
                            liked.tracks.length === 0 ? (
                                <EmptyState
                                    title="Aucun titre liké"
                                    message="Les titres que vous aimez apparaîtront ici."
                                    action={null}
                                />
                            ) : (
                                <div className="space-y-1">
                                    {liked.tracks.map((track) => (
                                        <LikedTrackRow
                                            key={track.id}
                                            track={track}
                                            onPlay={() => playTrack(track, liked.tracks)}
                                            onRemove={() => liked.removeLike(track.id)}
                                        />
                                    ))}
                                </div>
                            )
                )}

                {tab === 'artists' && (
                    followed.isLoading ? <LoadingState /> :
                        followed.artists.length === 0 ? (
                            <EmptyState
                                title="Aucun artiste suivi"
                                message="Les artistes que vous suivez apparaîtront ici."
                            />
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {followed.artists.map((artist) => (
                                    <FollowedArtistCard
                                        key={artist.id}
                                        artist={artist}
                                        onClick={() => navigate(`/artists/${artist.id}`)}
                                    />
                                ))}
                            </div>
                        )
                )}

                {tab === 'albums' && (
                    saved.isLoading ? <LoadingState /> :
                        saved.error ? <ErrorState message={saved.error} /> :
                            saved.albums.length === 0 ? (
                                <EmptyState
                                    title="Aucun album sauvegardé"
                                    message="Les albums que vous sauvegardez apparaîtront ici."
                                />
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {saved.albums.map((album) => (
                                        <SavedAlbumCard
                                            key={album.id}
                                            album={album}
                                            onClick={() => navigate(`/albums/${album.id}`)}
                                            onUnsave={() => saved.unsave(album.id)}
                                        />
                                    ))}
                                </div>
                            )
                )}
            </div>
        </div>
    )
}