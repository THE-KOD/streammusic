// features/admin/presentation/pages/admin-dashboard-page.tsx
import { AdminPageHeader } from '../components/admin-page-header'
import { StatCard } from '../components/stat-card'
import { TopTrackRow } from '../components/top-track-row'
import { Card } from '../../../../shared/components/card'
import { LoadingState, ErrorState, EmptyState } from '../../../../shared/components/states'
import { useAdminStats, useTopTracks } from '../hooks/use-admin'
import { LayoutDashboard, Users, Music2 } from 'lucide-react'

export function AdminDashboardPage() {
    const { stats, isLoading: statsLoading, error: statsError } = useAdminStats()
    const { tracks, isLoading: tracksLoading, error: tracksError } = useTopTracks()

    if (statsError || tracksError) {
        return <ErrorState message="Erreur de chargement du tableau de bord." onRetry={() => window.location.reload()} />
    }

    return (
        <div>
            <AdminPageHeader
                title="Dashboard"
                description="Vue d'ensemble de l'activité StreamMusic"
                icon={<LayoutDashboard className="w-5 h-5" />}
            />

            {/* Statistiques globales */}
            <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 rounded-full bg-amber" />
                    <h2 className="font-display text-lg font-semibold text-ivory tracking-tight">STATISTIQUES GLOBALES</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {statsLoading ? (
                        <>
                            <LoadingState />
                            <LoadingState />
                        </>
                    ) : stats ? (
                        <>
                            <StatCard
                                label="UTILISATEURS"
                                value={stats.totalUsers}
                                icon={<Users className="w-5 h-5" />}
                                trend={{ value: 12, direction: 'up' }}
                            />
                            <StatCard
                                label="ÉCOUTES"
                                value={stats.totalPlays}
                                icon={<Music2 className="w-5 h-5" />}
                                trend={{ value: 8, direction: 'up' }}
                            />
                        </>
                    ) : null}
                </div>
            </section>

            {/* Titres les plus écoutés */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 rounded-full bg-amber" />
                    <h2 className="font-display text-lg font-semibold text-ivory tracking-tight">TITRES LES PLUS ÉCOUTÉS</h2>
                </div>
                <Card className="p-5 border border-white/5 hover:border-white/10 transition-all duration-200">
                    {tracksLoading ? (
                        <LoadingState />
                    ) : tracksError ? (
                        <ErrorState message={tracksError} onRetry={() => window.location.reload()} />
                    ) : tracks.length === 0 ? (
                        <EmptyState message="Aucun titre populaire." />
                    ) : (
                        <div className="space-y-1">
                            <div className="grid grid-cols-[3.5rem_1fr_1fr_auto] gap-4 px-3 py-1.5 text-xs uppercase tracking-wider text-muted font-body border-b border-white/5">
                                <span>#</span>
                                <span>Titre</span>
                                <span className="hidden md:block">Artiste</span>
                                <span>Écoutes</span>
                            </div>
                            {tracks.map((track, idx) => (
                                <TopTrackRow
                                    key={track.id}
                                    rank={idx + 1}
                                    title={track.title}
                                    artist={track.artistName}
                                    plays={track.playCount}
                                />
                            ))}
                        </div>
                    )}
                </Card>
            </section>
        </div>
    )
}