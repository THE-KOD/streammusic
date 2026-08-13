import { LoadingState, EmptyState, ErrorState } from '../../../../shared/components/states'
import { HistoryDateGroup } from '../components/history-date-group'
import { useHistory } from '../hooks/use-history'
import { usePlayerStore } from '../../../player/presentation/store/player-store'
import type {Track} from "../../../../shared/types/track.ts";

export function ListeningHistoryPage() {
  const { entries, isLoading, error } = useHistory()
  const setCurrentTrack = usePlayerStore((state) => state.setCurrentTrack)

  const handlePlay = (track: Track) => {
    const storeTrack = {
      id: track.id,
      title: track.title,
      artist: track.artistName,
      album: track.albumTitle,
      duration: track.duration,
      coverUrl: track.coverUrl,
      fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    }
    setCurrentTrack(storeTrack)
  }

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />

  if (entries.length === 0) {
    return (
        <div>
          <h1 className="font-display text-4xl font-semibold text-ivory mb-6">Historique</h1>
          <EmptyState
              title="Votre historique est vide."
              message="Les titres que vous écouterez apparaîtront ici."
          />
        </div>
    )
  }

  // Grouper par date
  const groups: Record<string, { date: Date; entries: typeof entries }> = {}
  entries.forEach((entry) => {
    const key = entry.listenedAt.toDateString()
    if (!groups[key]) {
      groups[key] = { date: entry.listenedAt, entries: [] }
    }
    groups[key].entries.push(entry)
  })

  const sortedGroups = Object.values(groups).sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
      <div>
        <h1 className="font-display text-4xl font-semibold text-ivory mb-6">Historique</h1>
        {sortedGroups.map((group) => (
            <HistoryDateGroup
                key={group.date.toDateString()}
                date={group.date}
                entries={group.entries}
                onPlay={handlePlay}
            />
        ))}
      </div>
  )
}