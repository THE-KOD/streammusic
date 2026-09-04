//src/features/catalog-artist-profile/presentation/components/edit-artist-profile-modal.tsx
import { useState } from 'react'
import { Modal } from '../../../../shared/components/modal'
import { Button } from '../../../../shared/components/button'
import { CoverImageUpload } from '../../../../shared/components/cover-image-upload'

interface EditArtistProfileModalProps {
    isOpen: boolean
    onClose: () => void
    initialBio?: string
    onSave: (bio: string, photoFile: File | null) => Promise<void>
}

export function EditArtistProfileModal({ isOpen, onClose, initialBio = '', onSave }: EditArtistProfileModalProps) {
    const [bio, setBio] = useState(initialBio)
    const [photoFile, setPhotoFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async () => {
        setError(null)
        setIsLoading(true)
        try {
            await onSave(bio, photoFile)
            onClose()
        } catch {
            setError('Erreur lors de la mise à jour du profil.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Modifier mon profil artiste">
            <div className="flex flex-col gap-4">
                <div>
                    <label className="font-body text-sm text-ivory block mb-1.5">Biographie</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        disabled={isLoading}
                        rows={4}
                        maxLength={2000}
                        placeholder="Parlez de vous, de votre musique..."
                        className="w-full bg-surface text-ivory rounded-lg px-3.5 py-2.5 text-sm border border-white/10 focus:border-teal focus:ring-2 focus:ring-teal/30 transition-all duration-200 resize-none"
                    />
                </div>
                <div>
                    <label className="font-body text-sm text-ivory block mb-1.5">Photo (optionnel)</label>
                    <CoverImageUpload onImageSelect={setPhotoFile} onRemove={() => setPhotoFile(null)} disabled={isLoading} />
                </div>
                {error && <p className="text-xs text-danger">{error}</p>}
                <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                    <Button variant="ghost" size="md" onClick={onClose} disabled={isLoading}>Annuler</Button>
                    <Button variant="primary" size="md" onClick={handleSubmit} disabled={isLoading}>{isLoading ? 'Enregistrement...' : 'Enregistrer'}</Button>
                </div>
            </div>
        </Modal>
    )
}