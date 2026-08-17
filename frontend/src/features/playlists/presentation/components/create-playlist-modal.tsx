// features/playlists/presentation/components/create-playlist-modal.tsx
import { useState } from 'react'
import { Modal } from '../../../../shared/components/modal'
import { Input } from '../../../../shared/components/input'
import { Button } from '../../../../shared/components/button'
import type { Playlist } from '../../domain/playlist.entity'

interface CreatePlaylistModalProps {
    isOpen: boolean
    onClose: () => void
    onCreate: (name: string) => Promise<Playlist>
}

export function CreatePlaylistModal({ isOpen, onClose, onCreate }: CreatePlaylistModalProps) {
    const [name, setName] = useState('')
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
            await onCreate(name.trim())
            setName('')
            onClose()
        } catch {
            setError('Erreur lors de la création')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Créer une playlist">
            <div className="flex flex-col gap-5">
                <div>
                    <Input
                        label="Nom de la playlist"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ma nouvelle playlist"
                        maxLength={100}
                        error={error || undefined}
                        disabled={isLoading}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        className="text-lg"
                    />
                    <div className="flex justify-between text-xs text-muted/70 font-mono mt-1">
                        <span>{name.length} / 100</span>
                        <span>Caractères</span>
                    </div>
                </div>
                <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                    <Button variant="ghost" size="md" onClick={onClose} disabled={isLoading}>
                        Annuler
                    </Button>
                    <Button variant="primary" size="md" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Création...' : 'Créer'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}