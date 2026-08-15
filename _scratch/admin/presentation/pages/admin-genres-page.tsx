// features/admin/presentation/pages/admin-genres-page.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AdminPageHeader } from '../components/admin-page-header'
import { GenreRow } from '../components/genre-row'
import { Card } from '../../../../shared/components/card'
import { Button } from '../../../../shared/components/button'
import { LoadingState, ErrorState, EmptyState } from '../../../../shared/components/states'
import { GenreFormModal } from '../components/genre-form-modal'
import { ConfirmModal } from '../components/confirm-modal'
import { useGenres } from '../hooks/use-admin'
import { Tag, Plus } from 'lucide-react'

export function AdminGenresPage() {
    const navigate = useNavigate()
    const { genres, isLoading, error, createGenre, updateGenre, deleteGenre } = useGenres()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [editingGenre, setEditingGenre] = useState<{ id: string; name: string } | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deleteGenreId, setDeleteGenreId] = useState<string | null>(null)
    const [isActionLoading, setIsActionLoading] = useState(false)

    const handleCreate = async (name: string) => {
        await createGenre(name)
    }

    const handleUpdate = async (name: string) => {
        if (!editingGenre) return
        await updateGenre(editingGenre.id, name)
        setEditingGenre(null)
    }

    const handleDelete = async () => {
        if (!deleteGenreId) return
        setIsActionLoading(true)
        try {
            await deleteGenre(deleteGenreId)
        } finally {
            setIsActionLoading(false)
            setIsDeleteModalOpen(false)
            setDeleteGenreId(null)
        }
    }

    if (error) {
        return <ErrorState message={error} onRetry={() => window.location.reload()} />
    }

    return (
        <div>
            <AdminPageHeader
                title="Modération"
                description="Contenus soumis et catalogue des genres"
                icon={<Tag className="w-5 h-5" />}
            />

            {/* Navigation interne */}
            <div className="flex gap-6 mb-6 border-b border-white/5 pb-3">
                <button
                    onClick={() => navigate('/admin/moderation')}
                    className="font-body text-sm pb-3 text-muted hover:text-ivory transition-all duration-200 border-b-2 border-transparent hover:border-white/10"
                >
                    Contenus
                </button>
                <button
                    className="font-body text-sm pb-3 text-teal border-b-2 border-teal font-medium transition-all duration-200"
                >
                    Genres
                </button>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-8 rounded-full bg-amber" />
                    <h2 className="font-display text-2xl font-semibold text-ivory tracking-tight">Genres musicaux</h2>
                    <span className="text-xs text-muted bg-surface-raised px-2 py-0.5 rounded-full border border-white/5">
            {genres.length}
          </span>
                </div>
                <Button variant="primary" size="md" onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Ajouter un genre
                </Button>
            </div>

            {isLoading ? (
                <LoadingState />
            ) : genres.length === 0 ? (
                <EmptyState
                    message="Aucun genre disponible."
                    action={<Button variant="primary" size="md" onClick={() => setIsCreateModalOpen(true)}>Ajouter un genre</Button>}
                />
            ) : (
                <Card className="p-2 border border-white/5 hover:border-white/10 transition-all duration-200">
                    <div className="hidden md:grid md:grid-cols-[1fr_auto] gap-4 px-4 py-2 text-xs uppercase tracking-wider text-muted font-body border-b border-white/5">
                        <span>Nom du genre</span>
                        <span>Actions</span>
                    </div>
                    <div className="divide-y divide-white/5">
                        {genres.map((genre) => (
                            <GenreRow
                                key={genre.id}
                                name={genre.name}
                                onEdit={() => setEditingGenre({ id: genre.id, name: genre.name })}
                                onDelete={() => { setDeleteGenreId(genre.id); setIsDeleteModalOpen(true) }}
                            />
                        ))}
                    </div>
                </Card>
            )}

            <GenreFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Nouveau genre"
                onSubmit={handleCreate}
                submitLabel="Créer"
            />

            {editingGenre && (
                <GenreFormModal
                    isOpen={true}
                    onClose={() => setEditingGenre(null)}
                    title="Modifier le genre"
                    initialName={editingGenre.name}
                    onSubmit={handleUpdate}
                    submitLabel="Enregistrer"
                />
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setDeleteGenreId(null) }}
                title="Supprimer ce genre ?"
                message="Cette action peut être refusée si le genre est utilisé par un titre."
                confirmLabel="Confirmer"
                confirmVariant="danger"
                onConfirm={handleDelete}
                isLoading={isActionLoading}
            />
        </div>
    )
}