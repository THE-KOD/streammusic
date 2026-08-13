import { useState } from 'react'
import { Modal } from '../../../../shared/components/modal'
import { Button } from '../../../../shared/components/button'
import type { Playlist } from '../../../../shared/types/playlist'

interface DeletePlaylistModalProps {
    isOpen: boolean
    onClose: () => void
    playlist: Playlist
    onDelete: (id: string) => Promise<void>
}

export function DeletePlaylistModal({ isOpen, onClose, playlist, onDelete }: DeletePlaylistModalProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            await onDelete(playlist.id)
            onClose()
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Supprimer la playlist">
            <div className="flex flex-col gap-4">
                <p className="text-ivory font-body">
                    Voulez-vous vraiment supprimer « {playlist.name} » ?
                </p>
                <p className="text-sm text-muted">Cette action est irréversible.</p>
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" size="md" onClick={onClose} disabled={isLoading}>
                        Annuler
                    </Button>
                    <Button variant="danger" size="md" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Suppression...' : 'Supprimer'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}