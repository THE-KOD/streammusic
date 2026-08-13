import { useState } from 'react'
import { Modal } from '../../../../shared/components/modal'
import { Button } from '../../../../shared/components/button'
import type { Playlist } from '../../../../shared/types/playlist'

interface PlaylistVisibilityControlProps {
    isOpen: boolean
    onClose: () => void
    playlist: Playlist
    onUpdate: (id: string, isPublic: boolean) => Promise<void>
}

export function PlaylistVisibilityControl({
                                              isOpen,
                                              onClose,
                                              playlist,
                                              onUpdate,
                                          }: PlaylistVisibilityControlProps) {
    const [isPublic, setIsPublic] = useState(playlist.isPublic)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            await onUpdate(playlist.id, isPublic)
            onClose()
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Visibilité">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="radio"
                            checked={!isPublic}
                            onChange={() => setIsPublic(false)}
                            className="accent-teal"
                        />
                        <span className="text-ivory font-body">Privée</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="radio"
                            checked={isPublic}
                            onChange={() => setIsPublic(true)}
                            className="accent-teal"
                        />
                        <span className="text-ivory font-body">Publique</span>
                    </label>
                </div>
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