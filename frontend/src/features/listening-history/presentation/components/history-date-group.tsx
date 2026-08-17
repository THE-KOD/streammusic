import { HistoryTrackRow } from './history-track-row'
import type { Track } from '../../../../shared/types/track'

interface HistoryEntry {
    id: string
    track: Track
    listenedAt: Date
}

interface HistoryDateGroupProps {
    date: Date
    entries: HistoryEntry[]
    onPlay: (track: Track) => void
}

function formatDateLabel(date: Date): string {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return "AUJOURD'HUI"
    if (date.toDateString() === yesterday.toDateString()) return "HIER"
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
}

export function HistoryDateGroup({ date, entries, onPlay }: HistoryDateGroupProps) {
    return (
        <div className="space-y-2">
            <h3 className="font-body text-xs font-semibold uppercase tracking-wider text-muted/70 border-b border-white/5 pb-2">
                {formatDateLabel(date)}
            </h3>
            <div className="space-y-1">
                {entries.map((entry) => (
                    <HistoryTrackRow
                        key={entry.id}
                        track={entry.track}
                        listenedAt={entry.listenedAt}
                        onPlay={() => onPlay(entry.track)}
                    />
                ))}
            </div>
        </div>
    )
}