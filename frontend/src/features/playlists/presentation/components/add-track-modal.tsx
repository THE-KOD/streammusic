import { useState } from 'react'
import { Modal } from '../../../../shared/components/modal'
import { Input } from '../../../../shared/components/input'
import { Button } from '../../../../shared/components/button'
import { Card } from '../../../../shared/components/card'
import { formatDuration } from '../../../../shared/utils/format-duration'
import { CATALOG_TRACKS_MOCK } from '../../../../shared/mocks/catalog-tracks.mock'

interface AddTrackModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (trackId: string) => Promise<void>
    existingTrackIds: string[]
}

export function AddTrackModal({ isOpen, onClose, onAdd, existingTrackIds }: AddTrackModalProps) {
    const [query, setQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const filteredTracks = CATALOG_TRACKS_MOCK
        .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()) || t.artistName.toLowerCase().includes(query.toLowerCase()))
        .filter((t) => !existingTrackIds.includes(t.id))

    const handleAdd = async () => {
        if (!selectedId) return
        setIsLoading(true)
        try {
            await onAdd(selectedId)
            setSelectedId(null)
            setQuery('')
            onClose()
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un titre">
            <div className="flex flex-col gap-4">
                <Input placeholder="Rechercher un titre..." value={query} onChange={(e) => setQuery(e.target.value)} disabled={isLoading} />
                <div className="max-h-60 overflow-y-auto space-y-1">
                    {filteredTracks.length === 0 ? (
                        <p className="text-sm text-muted text-center py-4">Aucun titre disponible</p>
                    ) : (
                        filteredTracks.map((track) => (
                            <Card key={track.id} className={`cursor-pointer transition-colors ${selectedId === track.id ? 'bg-surface-raised border-teal' : ''}`} onClick={() => setSelectedId(track.id)}>
                                <div className="flex items-center justify-between">
                                    <div><p className="font-body text-ivory">{track.title}</p><p className="text-sm text-muted">{track.artistName}</p></div>
                                    <span className="font-mono text-xs text-muted">{formatDuration(track.duration)}</span>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" size="md" onClick={onClose} disabled={isLoading}>Annuler</Button>
                    <Button variant="primary" size="md" onClick={handleAdd} disabled={!selectedId || isLoading}>{isLoading ? 'Ajout...' : 'Ajouter'}</Button>
                </div>
            </div>
        </Modal>
    )
}