import { usePlayerStore } from '../store/player-store'
import { QueueItem } from '../../../../../../_scratch/player/composant/queue-item.tsx'
import { EmptyState } from '../../../../shared/components/states'
import { Button } from '../../../../shared/components/button'

export function QueuePage() {
  const {
    queue,
    currentTrack,
    isPlaying,
    setCurrentTrack,
    removeFromQueue,
    moveInQueue,
    clearQueue,
  } = usePlayerStore()

  const handlePlayTrack = (index: number) => {
    const track = queue[index]
    if (track) {
      setCurrentTrack(track, queue)
    }
  }

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      moveInQueue(index, index - 1)
    }
  }

  const handleMoveDown = (index: number) => {
    if (index < queue.length - 1) {
      moveInQueue(index, index + 1)
    }
  }

  if (queue.length === 0) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <EmptyState
              title="File d'attente vide"
              message="Ajoutez des titres depuis le catalogue pour les retrouver ici."
          />
        </div>
    )
  }

  return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-semibold text-ivory">File d'attente</h1>
          <Button variant="ghost" size="sm" onClick={clearQueue}>
            Vider la file
          </Button>
        </div>

        <div className="space-y-1">
          {queue.map((track, index) => (
              <QueueItem
                  key={`${track.id}-${index}`}
                  track={track}
                  index={index}
                  isCurrent={currentTrack?.id === track.id}
                  isPlaying={isPlaying && currentTrack?.id === track.id}
                  onPlay={() => handlePlayTrack(index)}
                  onRemove={() => removeFromQueue(index)}
                  onMoveUp={() => handleMoveUp(index)}
                  onMoveDown={() => handleMoveDown(index)}
                  canMoveUp={index > 0}
                  canMoveDown={index < queue.length - 1}
              />
          ))}
        </div>

        <div className="mt-4 text-sm text-muted text-center">
          {queue.length} titre{queue.length > 1 ? 's' : ''} dans la file
        </div>
      </div>
  )
}