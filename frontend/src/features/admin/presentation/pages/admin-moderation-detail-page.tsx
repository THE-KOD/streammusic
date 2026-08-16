import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Card } from '../../../../shared/components/card'
import { Button } from '../../../../shared/components/button'
import { LoadingState, ErrorState } from '../../../../shared/components/states'
import { ConfirmModal } from '../components/confirm-modal.tsx'
import { AdminPageHeader } from '../components/admin-page-header.tsx'
import { useModerationTracks } from '../hooks/use-admin-moderation'
import { formatDuration } from '../../../../shared/utils/format-duration'
import { Music, Calendar, Clock, Headphones, Tag, Album } from 'lucide-react'

export function AdminModerationDetailPage() {
    const { trackId } = useParams()
    const navigate = useNavigate()
    const { tracks, isLoading, error, updateStatus } = useModerationTracks()
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
    const [isActionLoading, setIsActionLoading] = useState(false)

    const track = tracks.find(t => t.id === trackId)

    const handleApprove = async () => {
        if (!track) return
        setIsActionLoading(true)
        try {
            await updateStatus(track.id, 'approved')
            setIsApproveModalOpen(false)
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleReject = async () => {
        if (!track) return
        setIsActionLoading(true)
        try {
            await updateStatus(track.id, 'rejected')
            setIsRejectModalOpen(false)
        } finally {
            setIsActionLoading(false)
        }
    }

    if (isLoading) return <LoadingState />
    if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />
    if (!track) return <ErrorState message="Titre introuvable." onRetry={() => navigate('/admin/moderation')} />

    const statusConfig = {
        pending: { color: 'text-amber bg-amber/10 border-amber/20', label: 'EN ATTENTE' },
        approved: { color: 'text-teal bg-teal/10 border-teal/20', label: 'VALIDE' },
        rejected: { color: 'text-danger bg-danger/10 border-danger/20', label: 'REJETE' },
    }
    const status = statusConfig[track.status]

    return (
        <div>
            <AdminPageHeader
                title="Détail du titre"
                description={`Modération de "${track.title}"`}
                icon={<Music className="w-5 h-5" />}
            />

            <div className="space-y-6">
                {/* Identité du titre */}
                <Card className="p-6 border border-white/5 hover:border-white/10 transition-all duration-200">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-40 h-40 rounded-xl overflow-hidden bg-surface-raised flex-shrink-0 border border-white/5">
                            {track.coverUrl ? (
                                <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted text-sm">
                                    <div className="text-center">
                                        <Music className="w-8 h-8 mx-auto mb-1 opacity-30" />
                                        <span>No cover</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h2 className="font-display text-2xl font-semibold text-ivory">{track.title}</h2>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {status.label}
                </span>
                            </div>
                            <p className="text-muted font-body text-lg">{track.artistName}</p>
                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                    {track.genreName || 'Non défini'}
                </span>
                                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                                    {track.submittedAt}
                </span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Métadonnées */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-5 border border-white/5 hover:border-white/10 transition-all duration-200">
                        <h3 className="font-display text-xs font-semibold text-muted uppercase tracking-wide mb-3">Informations</h3>
                        <div className="space-y-2.5 text-sm">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-muted flex items-center gap-2">
                  <Album className="w-3.5 h-3.5" /> Album
                </span>
                                <span className="text-ivory font-body">{track.albumTitle || '-'}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-muted flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" /> Genre
                </span>
                                <span className="text-ivory font-body">{track.genreName || '-'}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-muted flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Durée
                </span>
                                <span className="font-mono text-ivory">{formatDuration(track.duration)}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-muted flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Date de sortie
                </span>
                                <span className="font-mono text-ivory">{track.releaseDate || '-'}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-muted flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Date d'ajout
                </span>
                                <span className="font-mono text-ivory">{track.submittedAt}</span>
                            </div>
                            <div className="flex justify-between items-center">
                <span className="text-muted flex items-center gap-2">
                  <Headphones className="w-3.5 h-3.5" /> Écoutes
                </span>
                                <span className="font-mono text-ivory">{track.playCount || 0}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 border border-white/5 hover:border-white/10 transition-all duration-200 flex flex-col">
                        <h3 className="font-display text-xs font-semibold text-muted uppercase tracking-wide mb-3">Fichier audio</h3>
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4 bg-surface-raised/30 rounded-xl border border-white/5">
                            <Music className="w-8 h-8 text-muted/40" />
                            <audio controls src={track.fileUrl} className="w-full" />
                        </div>
                    </Card>
                </div>

                {/* Actions */}
                <Card className="p-5 border border-white/5">
                    <h3 className="font-display text-xs font-semibold text-muted uppercase tracking-wide mb-3">Actions de modération</h3>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="danger"
                            size="lg"
                            onClick={() => setIsRejectModalOpen(true)}
                            className="gap-2"
                        >
                            Rejeter
                        </Button>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => setIsApproveModalOpen(true)}
                            className="gap-2"
                        >
                            Valider
                        </Button>
                    </div>
                </Card>
            </div>

            <ConfirmModal
                isOpen={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                title="Valider ce titre ?"
                message="Le contenu passera au statut VALIDE et sera visible dans le catalogue."
                confirmLabel="Valider"
                confirmVariant="primary"
                onConfirm={handleApprove}
                isLoading={isActionLoading}
            />

            <ConfirmModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                title="Rejeter ce titre ?"
                message="Le contenu passera au statut REJETE. Cette action est irréversible."
                confirmLabel="Rejeter"
                confirmVariant="danger"
                onConfirm={handleReject}
                isLoading={isActionLoading}
            />
        </div>
    )
}