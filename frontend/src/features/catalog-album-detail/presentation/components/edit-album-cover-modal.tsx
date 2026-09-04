//src/features/catalog-album-detail/presentation/components/edit-album-cover-modal.tsx
import { useState } from 'react'
import { Modal } from '../../../../shared/components/modal'
import { Button } from '../../../../shared/components/button'
import { CoverImageUpload } from '../../../../shared/components/cover-image-upload'

interface EditAlbumCoverModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (coverFile: File) => Promise<void>
}

export function EditAlbumCoverModal({ isOpen, onClose, onSave }: EditAlbumCoverModalProps) {
    const [coverFile, setCoverFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async () => {
        if (!coverFile) { setError('Sélectionnez une image.'); return }
        setError(null)
        setIsLoading(true)
        try {
            await onSave(coverFile)
            setCoverFile(null)
            onClose()
        } catch {
            setError('Erreur lors de la mise à jour de la pochette.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Modifier la pochette">
            <div className="flex flex-col gap-4">
                <CoverImageUpload onImageSelect={setCoverFile} onRemove={() => setCoverFile(null)} disabled={isLoading} />
                {error && <p className="text-xs text-danger">{error}</p>}
                <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                    <Button variant="ghost" size="md" onClick={onClose} disabled={isLoading}>Annuler</Button>
                    <Button variant="primary" size="md" onClick={handleSubmit} disabled={isLoading}>{isLoading ? 'Enregistrement...' : 'Enregistrer'}</Button>
                </div>
            </div>
        </Modal>
    )
}