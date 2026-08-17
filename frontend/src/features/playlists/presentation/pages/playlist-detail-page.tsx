// features/playlists/presentation/pages/playlist-detail-page.tsx
import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Button } from '../../../../shared/components/button'
import { LoadingState, EmptyState, ErrorState } from '../../../../shared/components/states'
import { PlaylistHeader } from '../components/playlist-header'
import { PlaylistTrackList } from '../components/playlist-track-list'
import { RenamePlaylistModal } from '../components/rename-playlist-modal'
import { PlaylistVisibilityControl } from '../components/playlist-visibility-control'
import { DeletePlaylistModal } from '../components/delete-playlist-modal'
import { AddTrackModal } from '../components/add-track-modal'
import { usePlaylistDetail } from '../hooks/use-playlist-detail'
import { usePlayerStore } from '../../../player/presentation/store/player-store'
import { ArrowLeft } from 'lucide-react'

export function PlaylistDetailPage() {
    const { playlistId } = useParams<{ playlistId: string }>()
    const navigate = useNavigate()
    const playTrack = usePlayerStore((state) => state.playTrack)
    const addToQueue = usePlayerStore((state) => state.addToQueue)

    const { playlist, tracks, isLoading, error, addTrack, removeTrack, reorderTracks, renamePlaylist, updateVisibility, deletePlaylist } =
        usePlaylistDetail(playlistId || '')

    const [isRenameOpen, setIsRenameOpen] = useState(false)
    const [isVisibilityOpen, setIsVisibilityOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isAddTrackOpen, setIsAddTrackOpen] = useState(false)

    const totalDuration = useMemo(
        () => tracks.reduce((sum, t) => sum + t.track.duration, 0),
        [tracks]
    )

    if (isLoading) return <LoadingState />
    if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />
    if (!playlist) return <EmptyState message="Playlist introuvable" action={<Button variant="secondary" onClick={() => navigate('/playlists')}>Retour</Button>} />

    const trackQueue = tracks.map((t) => t.track)

    const handlePlayAll = () => {
        if (tracks.length > 0) playTrack(trackQueue[0], trackQueue)
    }
    const handlePlayTrack = (trackId: string) => {
        const track = trackQueue.find((t) => t.id === trackId)
        if (track) playTrack(track, trackQueue)
    }
    const handleAddToQueue = (trackId: string) => {
        const track = trackQueue.find((t) => t.id === trackId)
        if (track) addToQueue(track)
    }
    const handleDelete = async (id: string) => {
        await deletePlaylist(id)
        navigate('/playlists')
    }

    return (
        <div className="space-y-8">
            {/* Bouton retour */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => navigate('/playlists')} className="gap-1">
                    <ArrowLeft className="w-4 h-4" />
                    Mes playlists
                </Button>
            </div>

            {/* En-tête */}
            <PlaylistHeader
                playlist={playlist}
                totalDuration={totalDuration}
                onPlay={handlePlayAll}
                onRename={() => setIsRenameOpen(true)}
                onVisibilityChange={() => setIsVisibilityOpen(true)}
                onDelete={() => setIsDeleteOpen(true)}
            />

            {/* Tracklist */}
            <div className="space-y-4">
                <PlaylistTrackList
                    tracks={tracks}
                    isReorderable
                    onPlay={handlePlayTrack}
                    onAddToQueue={handleAddToQueue}
                    onRemove={removeTrack}
                    onReorder={reorderTracks}
                />
                <div className="flex justify-start">
                    <Button
                        variant={tracks.length === 0 ? 'primary' : 'secondary'}
                        size="md"
                        onClick={() => setIsAddTrackOpen(true)}
                    >
                        + Ajouter un titre
                    </Button>
                </div>
            </div>

            {/* Modals */}
            <RenamePlaylistModal
                isOpen={isRenameOpen}
                onClose={() => setIsRenameOpen(false)}
                playlist={playlist}
                onRename={renamePlaylist}
            />
            <PlaylistVisibilityControl
                isOpen={isVisibilityOpen}
                onClose={() => setIsVisibilityOpen(false)}
                playlist={playlist}
                onUpdate={updateVisibility}
            />
            <DeletePlaylistModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                playlist={playlist}
                onDelete={handleDelete}
            />
            <AddTrackModal
                isOpen={isAddTrackOpen}
                onClose={() => setIsAddTrackOpen(false)}
                onAdd={addTrack}
                existingTrackIds={tracks.map((t) => t.track.id)}
            />
        </div>
    )
}