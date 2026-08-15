import { LoadingState, EmptyState } from '../../../../shared/components/states'
import { HistoryDateGroup } from '../components/history-date-group'
import { useHistory } from '../hooks/use-history'
import { usePlayerStore } from '../../../player/presentation/store/player-store'
import type { Track } from '../../../../shared/types/track'

export function ListeningHistoryPage() {
  const { entries, isLoading } = useHistory()
  const playTrack = usePlayerStore((state) => state.playTrack)

  const handlePlay = (track: Track) => playTrack(track)

  if (isLoading) return <LoadingState />

  if (entries.length === 0) {
    return (
        <div>
          <h1 className="font-display text-4xl font-semibold text-ivory mb-6">Historique</h1>
          <EmptyState title="Votre historique est vide." message="Les titres que vous écouterez apparaîtront ici." />
        </div>
    )
  }

  const groups: Record<string, { date: Date; entries: typeof entries }> = {}
  entries.forEach((entry) => {
    const key = entry.listenedAt.toDateString()
    if (!groups[key]) groups[key] = { date: entry.listenedAt, entries: [] }
    groups[key].entries.push(entry)
  })
  const sortedGroups = Object.values(groups).sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
      <div>
        <h1 className="font-display text-4xl font-semibold text-ivory mb-6">Historique</h1>
        {sortedGroups.map((group) => <HistoryDateGroup key={group.date.toDateString()} date={group.date} entries={group.entries} onPlay={handlePlay} />)}
      </div>
  )
}