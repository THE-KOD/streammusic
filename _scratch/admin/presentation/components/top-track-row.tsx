// features/admin/presentation/components/top-track-row.tsx
import { Award } from 'lucide-react'

interface TopTrackRowProps {
    rank: number
    title: string
    artist: string
    plays: number
}

const rankColors = {
    1: 'text-amber bg-amber/10 border-amber/20',
    2: 'text-muted bg-surface-raised border-white/10',
    3: 'text-muted bg-surface-raised border-white/10',
}

export function TopTrackRow({ rank, title, artist, plays }: TopTrackRowProps) {
    const isTop = rank <= 3
    const colorClass = isTop ? rankColors[rank as keyof typeof rankColors] : 'text-muted bg-transparent'

    return (
        <div className="grid grid-cols-[3.5rem_1fr_1fr_auto] gap-4 px-3 py-2.5 rounded-xl hover:bg-surface-raised/50 transition-all duration-200 group border border-transparent hover:border-white/5">
            <div className="flex items-center gap-2">
                {isTop ? (
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-semibold border ${colorClass}`}>
                        {rank}
                    </div>
                ) : (
                    <span className="font-mono text-sm text-muted w-7 text-center">{rank}</span>
                )}
                {isTop && <Award className={`w-3.5 h-3.5 ${rank === 1 ? 'text-amber' : 'text-muted'}`} />}
            </div>
            <span className="font-display text-ivory truncate group-hover:text-amber transition-colors">{title}</span>
            <span className="font-body text-sm text-muted truncate">{artist}</span>
            <span className="font-mono text-sm text-ivory/80 tabular-nums">{plays.toLocaleString()}</span>
        </div>
    )
}