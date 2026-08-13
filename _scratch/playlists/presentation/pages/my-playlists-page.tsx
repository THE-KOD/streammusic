import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../../../../shared/components/button'
import { LoadingState, EmptyState, ErrorState } from '../../../../shared/components/states'
import { PlaylistCard } from '../components/playlist-card'
import { CreatePlaylistModal } from '../components/create-playlist-modal'
import { RenamePlaylistModal } from '../components/rename-playlist-modal'
import { PlaylistVisibilityControl } from '../components/playlist-visibility-control'
import { DeletePlaylistModal } from '../components/delete-playlist-modal'
import { usePlaylists } from '../hooks/use-playlists'

export function MyPlaylistsPage() {
  const navigate = useNavigate()
  const {
    playlists,
    isLoading,
    error,
    createPlaylist,
    renamePlaylist,
    updateVisibility,
    deletePlaylist,
  } = usePlaylists()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null)
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const editingPlaylist = playlists.find(p => p.id === editingPlaylistId)

  const handleOpen = (playlistId: string) => {
    navigate(`/playlists/${playlistId}`)
  }

  const handleRename = (playlistId: string) => {
    setEditingPlaylistId(playlistId)
    setIsRenameOpen(true)
  }

  const handleVisibility = (playlistId: string) => {
    setEditingPlaylistId(playlistId)
    setIsVisibilityOpen(true)
  }

  const handleDelete = (playlistId: string) => {
    setEditingPlaylistId(playlistId)
    setIsDeleteOpen(true)
  }

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />

  return (
      <>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl font-semibold text-ivory">Mes playlists</h1>
          <Button variant="primary" size="md" onClick={() => setIsCreateModalOpen(true)}>
            + Créer
          </Button>
        </div>

        {playlists.length === 0 ? (
            <EmptyState
                title="Aucune playlist"
                message="Vous n'avez pas encore de playlist."
                action={
                  <Button variant="primary" size="md" onClick={() => setIsCreateModalOpen(true)}>
                    Créer une playlist
                  </Button>
                }
            />
        ) : (
            <div className="flex flex-col gap-4">
              {playlists.map((playlist) => (
                  <PlaylistCard
                      key={playlist.id}
                      playlist={playlist}
                      onOpen={() => handleOpen(playlist.id)}
                      onRename={() => handleRename(playlist.id)}
                      onVisibilityChange={() => handleVisibility(playlist.id)}
                      onDelete={() => handleDelete(playlist.id)}
                  />
              ))}
            </div>
        )}

        <CreatePlaylistModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={createPlaylist}
        />

        {editingPlaylist && (
            <>
              <RenamePlaylistModal
                  isOpen={isRenameOpen}
                  onClose={() => { setIsRenameOpen(false); setEditingPlaylistId(null) }}
                  playlist={editingPlaylist}
                  onRename={renamePlaylist}
              />
              <PlaylistVisibilityControl
                  isOpen={isVisibilityOpen}
                  onClose={() => { setIsVisibilityOpen(false); setEditingPlaylistId(null) }}
                  playlist={editingPlaylist}
                  onUpdate={updateVisibility}
              />
              <DeletePlaylistModal
                  isOpen={isDeleteOpen}
                  onClose={() => { setIsDeleteOpen(false); setEditingPlaylistId(null) }}
                  playlist={editingPlaylist}
                  onDelete={deletePlaylist}
              />
            </>
        )}
      </>
  )
}