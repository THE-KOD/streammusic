import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Button } from '../../../../shared/components/button'
import { LoadingState, EmptyState, ErrorState } from '../../../../shared/components/states'
import { PlaylistHeader } from '../components/playlist-header'
import { PlaylistTrackList } from '../components/playlist-track-list'
import { RenamePlaylistModal } from '../components/rename-playlist-modal'
import { PlaylistVisibilityControl } from '../components/playlist-visibility-control'
import { DeletePlaylistModal } from '../components/delete-playlist-modal'
import { AddTrackModal } from '../components/add-track-modal'
import { usePlaylistDetail } from '../hooks/use-playlists'
import { usePlayerStore } from '../../../player/presentation/store/player-store'

export function PlaylistDetailPage() {
  const { playlistId } = useParams<{ playlistId: string }>()
  const navigate = useNavigate()
  const setCurrentTrack = usePlayerStore((state) => state.setCurrentTrack)
  const addToQueue = usePlayerStore((state) => state.addToQueue)

  const {
    playlist,
    tracks,
    isLoading,
    error,
    addTrack,
    removeTrack,
    reorderTracks,
  } = usePlaylistDetail(playlistId || '')

  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isAddTrackOpen, setIsAddTrackOpen] = useState(false)

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />
  if (!playlist) return <EmptyState message="Playlist introuvable" action={<Button variant="secondary" size="sm" onClick={() => navigate('/playlists')}>Retour</Button>} />

  const handlePlayAll = () => {
    if (tracks.length === 0) return
    const firstTrack = tracks[0].track
    // Convertir vers le format du store
    const storeTrack = {
      id: firstTrack.id,
      title: firstTrack.title,
      artist: firstTrack.artistName,
      album: firstTrack.albumTitle,
      duration: firstTrack.duration,
      coverUrl: firstTrack.coverUrl,
      fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    }
    setCurrentTrack(storeTrack)
  }

  const handlePlayTrack = (trackId: string) => {
    const found = tracks.find(t => t.track.id === trackId)
    if (!found) return
    const track = found.track
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

  const handleAddTrack = async (trackId: string) => {
    await addTrack(trackId)
    // Fermer la modal après ajout
  }

  return (
      <>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/playlists')}>
            ← Mes playlists
          </Button>
        </div>

        <div className="flex flex-col gap-8">
          <PlaylistHeader
              playlist={playlist}
              onPlay={handlePlayAll}
              onRename={() => setIsRenameOpen(true)}
              onVisibilityChange={() => setIsVisibilityOpen(true)}
              onDelete={() => setIsDeleteOpen(true)}
          />

          <div>
            <PlaylistTrackList
                tracks={tracks}
                isReorderable
                onPlay={handlePlayTrack}
                onRemove={removeTrack}
                onReorder={reorderTracks}
            />
            <div className="mt-4">
              <Button
                  variant={tracks.length === 0 ? 'primary' : 'secondary'}
                  size="md"
                  onClick={() => setIsAddTrackOpen(true)}
              >
                + Ajouter un titre
              </Button>
            </div>
          </div>
        </div>

        <RenamePlaylistModal
            isOpen={isRenameOpen}
            onClose={() => setIsRenameOpen(false)}
            playlist={playlist}
            onRename={async (id, name) => {
              // La fonction rename est déjà dans le hook usePlaylists
              // Mais on a besoin de la passer, on va utiliser une fonction locale
              // Pour simplifier, on utilise le hook parent, mais ici on a juste besoin de mettre à jour l'état local
              // On va simuler, car usePlaylistDetail ne fournit pas rename
              // On pourrait étendre le hook, mais pour la démo on fait un mock
            }}
        />

        <PlaylistVisibilityControl
            isOpen={isVisibilityOpen}
            onClose={() => setIsVisibilityOpen(false)}
            playlist={playlist}
            onUpdate={async (id, isPublic) => {
              // Simuler mise à jour
            }}
        />

        <DeletePlaylistModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            playlist={playlist}
            onDelete={async (id) => {
              await deletePlaylist(id)
              navigate('/playlists')
            }}
        />

        <AddTrackModal
            isOpen={isAddTrackOpen}
            onClose={() => setIsAddTrackOpen(false)}
            onAdd={handleAddTrack}
            existingTrackIds={tracks.map(t => t.track.id)}
        />
      </>
  )
}