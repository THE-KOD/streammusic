// features/admin/presentation/pages/admin-user-detail-page.tsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Card } from '../../../../shared/components/card'
import { Avatar } from '../../../../shared/components/avatar'
import { Button } from '../../../../shared/components/button'
import { LoadingState, ErrorState } from '../../../../shared/components/states'
import { ConfirmModal } from '../components/confirm-modal'
import { AdminPageHeader } from '../components/admin-page-header'
import { useAdminUsers } from '../hooks/use-admin-users'
import { User, Mail, Calendar, Shield, Crown } from 'lucide-react'

export function AdminUserDetailPage() {
    const { userId } = useParams()
    const navigate = useNavigate()
    const { users, isLoading, error, suspendUser, deleteUser } = useAdminUsers()
    const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isActionLoading, setIsActionLoading] = useState(false)

    const user = users.find(u => u.id === userId)

    const handleSuspend = async () => {
        if (!user) return
        setIsActionLoading(true)
        try {
            await suspendUser(user.id)
            setIsSuspendModalOpen(false)
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!user) return
        setIsActionLoading(true)
        try {
            await deleteUser(user.id)
            setIsDeleteModalOpen(false)
            navigate('/admin/users')
        } finally {
            setIsActionLoading(false)
        }
    }

    if (isLoading) return <LoadingState />
    if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />
    if (!user) return <ErrorState message="Utilisateur introuvable." onRetry={() => navigate('/admin/users')} />

    return (
        <div>
            <AdminPageHeader
                title="Détail utilisateur"
                description={`Gestion du compte ${user.pseudo}`}
                icon={<User className="w-5 h-5" />}
            />

            <div className="space-y-6">
                <Card className="p-6 border border-white/5 hover:border-white/10 transition-all duration-200">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="flex-shrink-0 border-2 border-white/5 rounded-full">
                            <Avatar src={user.avatarUrl} name={user.pseudo} size="lg" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h2 className="font-display text-2xl font-semibold text-ivory">{user.pseudo}</h2>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                    user.isActive
                                        ? 'bg-teal/10 text-teal border-teal/20'
                                        : 'bg-danger/10 text-danger border-danger/20'
                                }`}>
                                    {user.isActive ? 'ACTIF' : 'SUSPENDU'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted font-body mt-1">
                                <Mail className="w-4 h-4" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted text-xs font-mono mt-1">
                                <Calendar className="w-3.5 h-3.5"/>
                                <span>Inscrit le {user.joinedAt.toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-5 border border-white/5 hover:border-white/10 transition-all duration-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-surface-raised border border-white/5">
                                <Shield className="w-4 h-4 text-muted" />
                            </div>
                            <div>
                                <h3 className="font-display text-xs font-semibold text-muted uppercase tracking-wide">Spécialisation</h3>
                                <p className="text-ivory font-body mt-0.5">
                                    {user.role === 'artist' ? 'Artiste' : user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 border border-white/5 hover:border-white/10 transition-all duration-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-surface-raised border border-white/5">
                                <Crown className="w-4 h-4 text-muted" />
                            </div>
                            <div>
                                <h3 className="font-display text-xs font-semibold text-muted uppercase tracking-wide">Abonnement</h3>
                                <p className={`font-body mt-0.5 font-medium ${
                                    user.subscriptionTier === 'premium' ? 'text-amber' : 'text-ivory'
                                }`}>
                                    {user.subscriptionTier === 'premium' ? 'PREMIUM' : 'GRATUIT'}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="p-5 border border-white/5">
                    <h3 className="font-display text-xs font-semibold text-muted uppercase tracking-wide mb-3">Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="danger"
                            size="md"
                            onClick={() => setIsSuspendModalOpen(true)}
                            className="gap-2"
                        >
                            {user.isActive ? 'Suspendre' : 'Réactiver'}
                        </Button>
                        <Button
                            variant="danger"
                            size="md"
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="gap-2"
                        >
                            Supprimer
                        </Button>
                    </div>
                </Card>
            </div>

            <ConfirmModal
                isOpen={isSuspendModalOpen}
                onClose={() => setIsSuspendModalOpen(false)}
                title={user.isActive ? 'Suspendre cet utilisateur ?' : 'Réactiver cet utilisateur ?'}
                message={user.isActive
                    ? 'Cette action modifiera son statut de compte. L\'utilisateur ne pourra plus se connecter.'
                    : 'Cette action réactivera le compte de l\'utilisateur.'
                }
                confirmLabel={user.isActive ? 'Suspendre' : 'Réactiver'}
                confirmVariant="danger"
                onConfirm={handleSuspend}
                isLoading={isActionLoading}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Supprimer cet utilisateur ?"
                message="Cette action supprimera le compte et les données associées. Cette opération est irréversible."
                confirmLabel="Supprimer"
                confirmVariant="danger"
                onConfirm={handleDelete}
                isLoading={isActionLoading}
            />
        </div>
    )
}