import { usePlayerStore, useCurrentTrack } from '../store/player-store'
import { QueueItem } from '../components/queue-item'
import { EmptyState } from '../../../../shared/components/states'
import { Button } from '../../../../shared/components/button'
import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'

export function QueuePage() {
    const { queue, isPlaying, currentIndex, playFromQueueIndex, removeFromQueue, moveInQueue, clearQueue } =
        usePlayerStore()
    const currentTrack = useCurrentTrack()

    if (queue.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <EmptyState
                    title="File d'attente vide"
                    message="Ajoutez des titres depuis le catalogue pour les retrouver ici."
                    action={
                        <Link to="/search">
                            <Button variant="primary" size="sm">
                                Explorer le catalogue
                            </Button>
                        </Link>
                    }
                />
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-semibold text-ivory">File d'attente</h1>
                    <p className="text-sm text-muted mt-0.5">
                        {queue.length} titre{queue.length > 1 ? 's' : ''} • {currentTrack && `en cours : ${currentTrack.title}`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link to="/home" aria-label="Retour à l'accueil">
                        <Button variant="ghost" size="sm" className="text-muted hover:text-ivory">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Retour</span>
                        </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={clearQueue} className="text-muted hover:text-danger">
                        Vider la file
                    </Button>
                </div>
            </div>

            {/* Mini-player du titre en cours */}
            {currentTrack && (
                <div className="bg-surface/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 flex items-center gap-4">
                    <div className="relative">
                        {currentTrack.coverUrl ? (
                            <img
                                src={currentTrack.coverUrl}
                                alt={currentTrack.title}
                                className="w-16 h-16 rounded-md object-cover shadow-md"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-md bg-surface-raised" />
                        )}
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber rounded-full shadow-lg shadow-amber/20" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-body text-lg text-ivory truncate">{currentTrack.title}</p>
                        <p className="text-sm text-muted truncate">{currentTrack.artistName}</p>
                    </div>
                    <span className="text-xs text-muted font-mono px-2 py-1 bg-surface-raised rounded-full">
            En cours
          </span>
                </div>
            )}

            {/* Liste de la file */}
            <div className="bg-surface/40 backdrop-blur-sm rounded-xl border border-white/5 p-2 space-y-1">
                {queue.map((track, index) => (
                    <QueueItem
                        key={`${track.id}-${index}`}
                        track={track}
                        index={index}
                        isCurrent={index === currentIndex}
                        isPlaying={isPlaying && index === currentIndex}
                        onPlay={() => playFromQueueIndex(index)}
                        onRemove={() => removeFromQueue(index)}
                        onMoveUp={() => index > 0 && moveInQueue(index, index - 1)}
                        onMoveDown={() => index < queue.length - 1 && moveInQueue(index, index + 1)}
                        canMoveUp={index > 0}
                        canMoveDown={index < queue.length - 1}
                    />
                ))}
            </div>

            {/* Pied de page */}
            <div className="text-center text-xs text-muted">
                {queue.length} titre{queue.length > 1 ? 's' : ''} dans la file
                {currentTrack && ` — en cours : ${currentTrack.title}`}
            </div>
        </div>
    )
}