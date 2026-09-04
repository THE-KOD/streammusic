import { useState } from 'react'
import { Modal } from '../../../../shared/components/modal'
import { Input } from '../../../../shared/components/input'
import { Button } from '../../../../shared/components/button'
import { CoverImageUpload } from '../../../../shared/components/cover-image-upload.tsx'

interface CreateAlbumModalProps {
    isOpen: boolean
    onClose: () => void
    onCreate: (title: string, releaseDate: string, coverFile: File | null) => Promise<void>
}

export function CreateAlbumModal({ isOpen, onClose, onCreate }: CreateAlbumModalProps) {
    const [title, setTitle] = useState('')
    const [releaseDate, setReleaseDate] = useState('')
    const [coverFile, setCoverFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async () => {
        if (!title.trim()) { setError('Le titre est obligatoire.'); return }
        if (!releaseDate) { setError('La date de sortie est obligatoire.'); return }
        setError(null)
        setIsLoading(true)
        try {
            await onCreate(title.trim(), releaseDate, coverFile)
            setTitle('')
            setReleaseDate('')
            setCoverFile(null)
            onClose()
        } catch {
            setError("Erreur lors de la création de l'album.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Créer un nouvel album">
            <div className="flex flex-col gap-4">
                <Input label="Titre de l'album" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isLoading} autoFocus />
                <Input label="Date de sortie" type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} disabled={isLoading} />
                <div>
                    <label className="font-body text-sm text-ivory block mb-1.5">Pochette (optionnel)</label>
                    <CoverImageUpload onImageSelect={setCoverFile} onRemove={() => setCoverFile(null)} disabled={isLoading} />
                </div>
                {error && <p className="text-xs text-danger">{error}</p>}
                <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                    <Button variant="ghost" size="md" onClick={onClose} disabled={isLoading}>Annuler</Button>
                    <Button variant="primary" size="md" onClick={handleSubmit} disabled={isLoading}>{isLoading ? 'Création...' : 'Créer'}</Button>
                </div>
            </div>
        </Modal>
    )
}