import { LoadingState, EmptyState } from '../../../../shared/components/states'
import { HistoryDateGroup } from '../components/history-date-group'
import { useHistory } from '../hooks/use-history'
import { usePlayerStore } from '../../../player/presentation/store/player-store'
import type { Track } from '../../../../shared/types/track'
import { Clock } from 'lucide-react'

export function ListeningHistoryPage() {
    const { entries, isLoading } = useHistory()
    const playTrack = usePlayerStore((state) => state.playTrack)

    const handlePlay = (track: Track) => playTrack(track)

    if (isLoading) return <LoadingState />

    if (entries.length === 0) {
        return (
            <div className="space-y-6">
                <div className="relative p-6 rounded-xl bg-gradient-to-br from-surface to-surface-raised border border-white/5 overflow-hidden">
                    <div className="absolute -right-12 -top-12 w-40 h-40 bg-amber/10 rounded-full blur-2xl" />
                    <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-teal/10 rounded-full blur-2xl" />
                    <div className="relative flex items-center gap-3">
                        <Clock className="w-8 h-8 text-amber" />
                        <div>
                            <h1 className="font-display text-3xl md:text-4xl font-semibold text-ivory">Historique</h1>
                            <p className="text-muted text-sm mt-1">Retrouvez vos écoutes récentes</p>
                        </div>
                    </div>
                </div>
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
        if (!groups[key]) groups[key] = { date: entry.listenedAt, entries: [] }
        groups[key].entries.push(entry)
    })
    const sortedGroups = Object.values(groups).sort((a, b) => b.date.getTime() - a.date.getTime())

    return (
        <div className="space-y-6">
            <div className="relative p-6 rounded-xl bg-gradient-to-br from-surface to-surface-raised border border-white/5 overflow-hidden">
                <div className="absolute -right-12 -top-12 w-40 h-40 bg-amber/10 rounded-full blur-2xl" />
                <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-teal/10 rounded-full blur-2xl" />
                <div className="relative flex items-center gap-3">
                    <Clock className="w-8 h-8 text-amber" />
                    <div>
                        <h1 className="font-display text-3xl md:text-4xl font-semibold text-ivory">Historique</h1>
                        <p className="text-muted text-sm mt-1">
                            {entries.length} titre{entries.length > 1 ? 's' : ''} écouté{entries.length > 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6 animate-fade-in">
                {sortedGroups.map((group) => (
                    <HistoryDateGroup
                        key={group.date.toDateString()}
                        date={group.date}
                        entries={group.entries}
                        onPlay={handlePlay}
                    />
                ))}
            </div>
        </div>
    )
}