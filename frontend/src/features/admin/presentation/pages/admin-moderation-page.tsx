// features/admin/presentation/pages/admin-moderation-page.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AdminPageHeader } from '../components/admin-page-header'
import { ModerationRow } from '../components/moderation-row'
import { Card } from '../../../../shared/components/card'
import { LoadingState, ErrorState, EmptyState } from '../../../../shared/components/states'
import { useModerationTracks } from '../hooks/use-admin-moderation'
import { Shield } from 'lucide-react'

export function AdminModerationPage() {
    const navigate = useNavigate()
    const [filter, setFilter] = useState<string>('all')
    const { tracks, isLoading, error } = useModerationTracks(filter)

    if (error) {
        return <ErrorState message={error} onRetry={() => window.location.reload()} />
    }

    return (
        <div>
            <AdminPageHeader
                title="Modération"
                description="Contenus soumis et catalogue des genres"
                icon={<Shield className="w-5 h-5" />}
            />

            {/* Navigation interne */}
            <div className="flex gap-6 mb-6 border-b border-white/5 pb-3">
                <button
                    onClick={() => setFilter('all')}
                    className={`font-body text-sm pb-3 transition-all duration-200 ${
                        filter === 'all'
                            ? 'text-teal border-b-2 border-teal font-medium'
                            : 'text-muted hover:text-ivory border-b-2 border-transparent'
                    }`}
                >
                    Contenus
                </button>
                <button
                    onClick={() => navigate('/admin/genres')}
                    className="font-body text-sm pb-3 text-muted hover:text-ivory transition-all duration-200 border-b-2 border-transparent hover:border-white/10"
                >
                    Genres
                </button>
            </div>

            {/* Filtre */}
            <div className="flex items-center gap-3 mb-6 p-3 bg-surface-raised/30 rounded-xl border border-white/5">
                <span className="text-xs font-medium text-muted uppercase tracking-wider">Statut :</span>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-surface text-ivory rounded-lg px-3.5 py-1.5 text-sm border border-white/10 focus:border-teal focus:ring-1 focus:ring-teal transition-all duration-200"
                >
                    <option value="all">Tous</option>
                    <option value="pending">EN ATTENTE</option>
                    <option value="approved">VALIDE</option>
                    <option value="rejected">REJETÉ</option>
                </select>
            </div>

            {/* Liste */}
            {isLoading ? (
                <LoadingState />
            ) : tracks.length === 0 ? (
                <EmptyState message="Aucun contenu à modérer." />
            ) : (
                <Card className="p-2 border border-white/5 hover:border-white/10 transition-all duration-200">
                    <div className="hidden md:grid md:grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 px-4 py-2 text-xs uppercase tracking-wider text-muted font-body border-b border-white/5">
                        <span>Titre</span>
                        <span>Artiste</span>
                        <span>Genre</span>
                        <span>Date</span>
                        <span>Statut</span>
                    </div>
                    <div className="divide-y divide-white/5">
                        {tracks.map((track) => (
                            <ModerationRow
                                key={track.id}
                                title={track.title}
                                artist={track.artistName}
                                genre={track.genreName || '-'}
                                date={track.submittedAt}
                                status={track.status}
                                onDetail={() => navigate(`/admin/moderation/${track.id}`)}
                            />
                        ))}
                    </div>
                </Card>
            )}
        </div>
    )
}