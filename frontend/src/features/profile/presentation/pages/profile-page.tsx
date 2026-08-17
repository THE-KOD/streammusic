// features/profile/presentation/pages/profile-page.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '../../../../shared/components/page-header'
import { Avatar } from '../../../../shared/components/avatar'
import { Button } from '../../../../shared/components/button'
import { Input } from '../../../../shared/components/input'
import { LoadingState, EmptyState } from '../../../../shared/components/states'
import { useUser } from '../hooks/use-user'
import { useSubscription } from '../../../subscriptions'
import { Calendar, Mail, User as UserIcon, Crown } from 'lucide-react'

export function ProfilePage() {
    const navigate = useNavigate()
    const { user, isLoading, updateUser } = useUser()
    const { isPremium } = useSubscription()
    const [pseudo, setPseudo] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)

    useEffect(() => {
        if (user) setPseudo(user.pseudo)
    }, [user])

    const handleSave = async () => {
        setSaveError(null)
        setIsSaving(true)
        try {
            await updateUser({ pseudo })
        } catch {
            setSaveError("Erreur lors de l'enregistrement")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) return <LoadingState />
    if (!user) return <EmptyState message="Utilisateur introuvable" />

    return (
        <div className="space-y-8">
            <PageHeader title="Profil" subtitle="Gérez vos informations personnelles" />

            {/* Avatar section */}
            <div className="flex flex-col items-center p-6 rounded-xl bg-surface/40 backdrop-blur-sm border border-white/5">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-amber/20 blur-xl -z-10" />
                    <div className="absolute -inset-1 rounded-full border-2 border-amber/30" />
                    <Avatar src={user.avatarUrl} name={user.pseudo} size="xl" />
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <span className="font-display text-xl text-ivory">{user.pseudo}</span>
                    {isPremium && <Crown className="w-4 h-4 text-amber" />}
                </div>
                <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.isActive ? 'bg-teal/20 text-teal' : 'bg-muted/20 text-muted'}`}>
            {user.isActive ? '● Actif' : '● Inactif'}
          </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isPremium ? 'bg-amber/20 text-amber' : 'bg-surface-raised text-muted'}`}>
            {isPremium ? '★ Premium' : 'Gratuit'}
          </span>
                </div>
                <Button variant="secondary" size="sm" className="mt-4" disabled title="Disponible dans la prochaine version">
                    Changer de photo
                </Button>
            </div>

            {/* Informations */}
            <div className="space-y-4">
                <h2 className="font-display text-lg font-semibold text-ivory flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-muted" />
                    Informations du compte
                </h2>

                <div className="space-y-4 p-4 rounded-xl bg-surface/40 backdrop-blur-sm border border-white/5">
                    <div>
                        <label className="text-sm text-ivory font-body block mb-1">Pseudo</label>
                        <Input
                            value={pseudo}
                            onChange={(e) => setPseudo(e.target.value)}
                            disabled={isSaving}
                            className="text-base"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-ivory font-body block mb-1 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted" />
                            Email
                        </label>
                        <Input value={user.email} disabled className="text-base opacity-70" />
                        <span className="text-xs text-muted mt-1 block">Non modifiable</span>
                    </div>

                    <div>
                        <label className="text-sm text-ivory font-body block mb-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted" />
                            Date d'inscription
                        </label>
                        <div className="bg-surface/60 text-ivory rounded-lg px-3.5 py-2.5 text-sm border border-white/5 font-mono">
                            {user.joinedAt.toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {saveError && <p className="text-sm text-danger">{saveError}</p>}

            <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="primary" size="lg" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
                <Button variant="ghost" size="lg" onClick={() => navigate('/settings')}>
                    Paramètres →
                </Button>
            </div>
        </div>
    )
}