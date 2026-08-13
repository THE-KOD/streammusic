import { useState } from 'react'
import { Modal } from '../../../../shared/components/modal'
import { Input } from '../../../../shared/components/input'
import { Button } from '../../../../shared/components/button'
import type { Playlist } from '../../../../shared/types/playlist'

interface RenamePlaylistModalProps {
    isOpen: boolean
    onClose: () => void
    playlist: Playlist
    onRename: (id: string, name: string) => Promise<void>
}

export function RenamePlaylistModal({ isOpen, onClose, playlist, onRename }: RenamePlaylistModalProps) {
    const [name, setName] = useState(playlist.name)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('Le nom est requis')
            return
        }
        setError(null)
        setIsLoading(true)
        try {
            await onRename(playlist.id, name.trim())
            onClose()
        } catch {
            setError('Erreur lors du renommage')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Renommer la playlist">
            <div className="flex flex-col gap-4">
                <Input
                    label="Nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={error || undefined}
                    disabled={isLoading}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" size="md" onClick={onClose} disabled={isLoading}>
                        Annuler
                    </Button>
                    <Button variant="primary" size="md" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}