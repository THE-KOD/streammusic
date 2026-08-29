// features/playlists/presentation/components/add-track-modal.tsx
import { useState, useMemo } from 'react'
import { Modal } from '../../../../shared/components/modal'
import { Input } from '../../../../shared/components/input'
import { Button } from '../../../../shared/components/button'
import { Card } from '../../../../shared/components/card'
import { formatDuration } from '../../../../shared/utils/format-duration'
import { useTrackCatalog } from '../hooks/use-track-catalog'

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

    const { tracks: catalog, isLoading: isCatalogLoading } = useTrackCatalog()

    const filteredTracks = useMemo(() => {
        const q = query.toLowerCase().trim()
        return catalog
            .filter((t) => !existingTrackIds.includes(t.id))
            .filter((t) =>
                t.title.toLowerCase().includes(q) ||
                t.artistName.toLowerCase().includes(q)
            )
    }, [catalog, query, existingTrackIds])

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
                <Input
                    placeholder="Rechercher un titre ou un artiste..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={isLoading}
                    autoFocus
                />
                <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                    {isCatalogLoading ? (
                        <p className="text-sm text-muted text-center py-6">Chargement du catalogue...</p>
                    ) : filteredTracks.length === 0 ? (
                        <p className="text-sm text-muted text-center py-6">
                            {query ? 'Aucun titre trouvé' : 'Aucun titre disponible à ajouter'}
                        </p>
                    ) : (
                        filteredTracks.map((track) => (
                            <Card
                                key={track.id}
                                className={`cursor-pointer transition-all duration-150 ${
                                    selectedId === track.id ? 'border-teal bg-surface-raised' : 'border-white/5 hover:bg-surface-raised/60'
                                }`}
                                onClick={() => setSelectedId(track.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="min-w-0">
                                        <p className="font-body text-ivory truncate">{track.title}</p>
                                        <p className="text-sm text-muted truncate">{track.artistName}</p>
                                    </div>
                                    <span className="font-mono text-xs text-muted ml-4">
                    {formatDuration(track.duration)}
                  </span>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
                <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                    <Button variant="ghost" size="md" onClick={onClose} disabled={isLoading}>
                        Annuler
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleAdd}
                        disabled={!selectedId || isLoading}
                    >
                        {isLoading ? 'Ajout...' : 'Ajouter'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}