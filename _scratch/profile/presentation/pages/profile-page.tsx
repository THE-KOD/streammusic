import { useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '../../../../shared/components/page-header'
import { Avatar } from '../../../../shared/components/avatar'
import { Button } from '../../../../shared/components/button'
import { Input } from '../../../../shared/components/input'
import { GenreSelector } from '../../../../shared/components/genre-selector'
import { StatusBadge } from '../components/status-badge'
import { LoadingState, ErrorState } from '../../../../shared/components/states'
import { useUser } from '../hooks/use-user'
import { Lock } from 'lucide-react'

export function ProfilePage() {
    const navigate = useNavigate()
    const { user, isLoading, error, updateUser, updateGenres, allGenres } = useUser()
    const [pseudo, setPseudo] = useState('')
    const [genres, setGenres] = useState<string[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)

    if (user && !pseudo) {
        setPseudo(user.pseudo)
        setGenres(user.genres)
    }

    const handleSave = async () => {
        if (!user) return
        setSaveError(null)
        setIsSaving(true)
        try {
            await updateUser({ pseudo })
            await updateGenres(genres)
        } catch {
            setSaveError('Erreur lors de l\'enregistrement')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) return <LoadingState />
    if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />
    if (!user) return null

    return (
        <div>
            <PageHeader title="Profil" />

            {/* Avatar */}
            <div className="flex flex-col items-center mb-8">
                <Avatar src={user.avatarUrl} name={user.pseudo} size="xl" />
                <Button variant="secondary" size="sm" className="mt-3">
                    Modifier
                </Button>
            </div>

            {/* Informations */}
            <div className="space-y-4 mb-8">
                <h2 className="font-display text-lg font-semibold text-ivory">Informations du profil</h2>
                <div>
                    <label className="text-sm text-ivory font-body block mb-1">Pseudo</label>
                    <Input value={pseudo} onChange={(e) => setPseudo(e.target.value)} disabled={isSaving} />
                </div>
                <div>
                    <label className="text-sm text-ivory font-body block mb-1">Email</label>
                    <Input value={user.email} disabled className="pr-10" />
                    <span className="text-xs text-muted mt-1 block">Non modifiable</span>
                </div>
                <div>
                    <label className="text-sm text-ivory font-body block mb-1">Date d'inscription</label>
                    <div className="bg-surface text-ivory rounded-lg px-3.5 py-2.5 text-sm border border-white/10 flex items-center justify-between">
                        <span className="font-mono">{user.joinedAt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <Lock className="w-4 h-4 text-muted" />
                    </div>
                </div>
            </div>

            {/* Préférences musicales */}
            <div className="mb-8">
                <h2 className="font-display text-lg font-semibold text-ivory mb-1">Préférences musicales</h2>
                <p className="text-sm text-muted mb-3">Choisissez les genres que vous aimez</p>
                <GenreSelector
                    genres={allGenres}
                    selected={genres}
                    onChange={setGenres}
                    disabled={isSaving}
                />
                <Button variant="secondary" size="sm" className="mt-3">
                    Modifier
                </Button>
            </div>

            {/* Statut du compte */}
            <div className="mb-8 p-4 bg-surface rounded-xl">
                <h2 className="font-display text-lg font-semibold text-ivory mb-3">Statut du compte</h2>
                <div className="space-y-1">
                    <StatusBadge label="Compte" status="active" />
                    <StatusBadge label="Abonnement" status={user.isPremium ? 'premium' : 'free'} />
                </div>
            </div>

            {saveError && <p className="text-sm text-danger mb-4">{saveError}</p>}

            <Button
                variant="primary"
                size="lg"
                className="w-full md:w-auto"
                onClick={handleSave}
                disabled={isSaving}
            >
                {isSaving ? 'Enregistrement...' : 'ENREGISTRER LES MODIFICATIONS'}
            </Button>

            <div className="mt-6 text-center">
                <button
                    onClick={() => navigate('/settings')}
                    className="text-sm text-teal hover:underline font-body"
                >
                    Paramètres →
                </button>
            </div>
        </div>
    )
}