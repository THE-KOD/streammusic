// features/catalog-album-detail/presentation/components/album-actions.tsx
import { Play, Bookmark } from 'lucide-react'
import clsx from 'clsx'
import { Button } from '../../../../shared/components/button'

interface AlbumActionsProps {
    trackCount: number
    onPlayAll: () => void
    isSaved: boolean
    onToggleSave: () => void
}

export function AlbumActions({ trackCount, onPlayAll, isSaved, onToggleSave }: AlbumActionsProps) {
    return (
        <div className="mb-8 flex items-center gap-4">
            {trackCount > 0 ? (
                <Button variant="primary" size="lg" onClick={onPlayAll} className="gap-2">
                    <Play className="w-5 h-5" fill="currentColor" />
                    Lire l'album
                </Button>
            ) : (
                <p className="text-sm text-muted">Cet album ne contient aucun titre disponible.</p>
            )}
            <button
                onClick={onToggleSave}
                aria-label={isSaved ? 'Retirer des albums sauvegardés' : 'Sauvegarder cet album'}
                className={clsx(
                    'p-2.5 rounded-full border transition-all duration-200',
                    isSaved
                        ? 'border-teal text-teal bg-teal/10 hover:bg-teal/20'
                        : 'border-white/10 text-muted hover:text-ivory hover:border-white/30',
                )}
            >
                <Bookmark className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} />
            </button>
        </div>
    )
}