import { Music2 } from 'lucide-react'
import { LoadingState, EmptyState } from '../../../../shared/components/states'
import { MyTrackStatusRow } from '../components/my-track-status-row'
import { useMyTracks } from '../hooks/use-my-tracks'

export function MyTracksPage() {
    const { tracks, isLoading } = useMyTracks()

    if (isLoading) return <LoadingState />

    return (
        <div className="space-y-6">
            <div className="relative p-6 rounded-xl bg-gradient-to-br from-surface to-surface-raised border border-white/5 overflow-hidden">
                <div className="absolute -right-12 -top-12 w-40 h-40 bg-amber/10 rounded-full blur-2xl" />
                <div className="relative flex items-center gap-3">
                    <Music2 className="w-8 h-8 text-amber" />
                    <div>
                        <h1 className="font-display text-3xl md:text-4xl font-semibold text-ivory">Mes titres</h1>
                        <p className="text-muted text-sm mt-1">{tracks.length} titre{tracks.length > 1 ? 's' : ''} soumis</p>
                    </div>
                </div>
            </div>

            {tracks.length === 0 ? (
                <EmptyState title="Aucun titre soumis" message="Les titres que vous uploadez apparaîtront ici avec leur statut de modération." />
            ) : (
                <div className="space-y-1">
                    {tracks.map((t) => <MyTrackStatusRow key={t.id} track={t} />)}
                </div>
            )}
        </div>
    )
}