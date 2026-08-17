// features/playlists/presentation/pages/my-playlists-page.tsx
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
import { Plus } from 'lucide-react'

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

  const handleOpen = (playlistId: string) => navigate(`/playlists/${playlistId}`)
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
      <div className="space-y-8">
        {/* En-tête avec déco */}
        <div className="relative p-6 rounded-xl bg-gradient-to-br from-surface to-surface-raised border border-white/5 overflow-hidden">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-amber/10 rounded-full blur-2xl" />
          <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-teal/10 rounded-full blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-ivory">
                Mes playlists
              </h1>
              <p className="text-muted text-sm mt-1">
                {playlists.length} playlist{playlists.length > 1 ? 's' : ''} enregistrée{playlists.length > 1 ? 's' : ''}
              </p>
            </div>
            <Button variant="primary" size="md" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4" />
              Créer
            </Button>
          </div>
        </div>

        {/* Grille */}
        {playlists.length === 0 ? (
            <EmptyState
                title="Aucune playlist"
                message="Créez votre première playlist pour organiser vos titres."
                action={
                  <Button variant="primary" size="md" onClick={() => setIsCreateModalOpen(true)}>
                    Créer une playlist
                  </Button>
                }
            />
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Modals */}
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
      </div>
  )
}