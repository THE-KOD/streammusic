import { Play } from 'lucide-react'
import { Button } from '../../../../shared/components/button'

interface AlbumActionsProps {
    trackCount: number
    onPlayAll: () => void
}

export function AlbumActions({ trackCount, onPlayAll }: AlbumActionsProps) {
    if (trackCount === 0) {
        return <div className="mb-8"><p className="text-sm text-muted">Cet album ne contient aucun titre disponible.</p></div>
    }
    return (
        <div className="mb-8">
            <Button variant="primary" size="lg" onClick={onPlayAll}>
                <Play className="w-4 h-4" fill="currentColor" />
                Lire l'album
            </Button>
        </div>
    )
}