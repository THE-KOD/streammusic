// features/admin/presentation/pages/admin-users-page.tsx
import { useNavigate } from 'react-router'
import { AdminPageHeader } from '../components/admin-page-header'
import { UserRow } from '../components/user-row'
import { LoadingState, ErrorState, EmptyState } from '../../../../shared/components/states'
import { useAdminUsers } from '../hooks/use-admin-users'
import { Users } from 'lucide-react'
import { Card } from '../../../../shared/components/card'

export function AdminUsersPage() {
    const navigate = useNavigate()
    const { users, isLoading, error } = useAdminUsers()

    if (error) {
        return <ErrorState message={error} onRetry={() => window.location.reload()} />
    }

    return (
        <div>
            <AdminPageHeader
                title="Utilisateurs"
                description="Gestion des comptes StreamMusic"
                icon={<Users className="w-5 h-5" />}
            />

            <div className="mt-2">
                {isLoading ? (
                    <LoadingState />
                ) : users.length === 0 ? (
                    <EmptyState message="Aucun utilisateur trouvé." />
                ) : (
                    <Card className="p-2 border border-white/5 hover:border-white/10 transition-all duration-200">
                        <div className="hidden md:grid md:grid-cols-[1fr_1fr_auto_auto] gap-4 px-4 py-2 text-xs uppercase tracking-wider text-muted font-body border-b border-white/5">
                            <span>Utilisateur</span>
                            <span>Email</span>
                            <span>Statut</span>
                            <span>Inscription</span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {users.map((user) => (
                                <UserRow
                                    key={user.id}
                                    pseudo={user.pseudo}
                                    email={user.email}
                                    isActive={user.isActive}
                                    joinedAt={user.joinedAt}
                                    onDetail={() => navigate(`/admin/users/${user.id}`)}
                                />
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}