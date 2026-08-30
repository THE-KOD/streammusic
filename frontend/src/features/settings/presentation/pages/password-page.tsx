// features/settings/presentation/pages/password-page.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '../../../../shared/components/page-header'
import { Input } from '../../../../shared/components/input'
import { Button } from '../../../../shared/components/button'
import { Card } from '../../../../shared/components/card'
import { LoadingState } from '../../../../shared/components/states'
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useUser } from '../../../profile'
import { authService } from '../../../auth/data/auth.service'
import { useToastStore } from '../../../../core/store/toast-store'

export function PasswordPage() {
    const navigate = useNavigate()
    const { user, isLoading } = useUser()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const showToast = useToastStore((state) => state.showToast)

    if (isLoading) return <LoadingState />
    if (!user) return null

    if (user.authMethod === 'oauth') {
        return (
            <div className="space-y-6">
                <PageHeader title="Mot de passe" backTo="/settings" />
                <Card className="p-8 text-center border border-white/5">
                    <LockKeyhole className="w-16 h-16 text-muted mx-auto mb-4" />
                    <h3 className="font-display text-xl text-ivory">Compte connecté avec OAuth</h3>
                    <p className="text-sm text-muted max-w-sm mx-auto mt-2">
                        La gestion du mot de passe s'effectue auprès de votre fournisseur d'authentification.
                    </p>
                    <Button variant="secondary" size="md" className="mt-4" disabled>
                        Gérer mon compte
                    </Button>
                </Card>
            </div>
        )
    }

    const getPasswordStrength = (pwd: string) => {
        if (pwd.length === 0) return { label: '', color: '' }
        if (pwd.length < 6) return { label: 'Faible', color: 'text-danger' }
        if (pwd.length < 10) return { label: 'Moyen', color: 'text-amber' }
        return { label: 'Fort', color: 'text-teal' }
    }

    const strength = getPasswordStrength(newPassword)

    const handleSubmit = async () => {
        setError(null)
        if (newPassword !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.')
            return
        }
        if (newPassword.length < 8) {
            setError('Le mot de passe doit faire au moins 8 caractères.')
            return
        }
        setIsSubmitting(true)
        try {
            await authService.changePassword(currentPassword, newPassword)
            showToast('Mot de passe modifié avec succès', 'success')
            navigate('/settings')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du changement de mot de passe.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader title="Mot de passe" subtitle="Modifiez votre mot de passe pour sécuriser votre compte" backTo="/settings" />

            <Card className="p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-5">
                    <ShieldCheck className="w-6 h-6 text-teal" />
                    <div>
                        <h2 className="font-display text-lg text-ivory">Sécurité du compte</h2>
                        <p className="text-sm text-muted">Utilisez un mot de passe fort et unique.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-ivory font-body block mb-1">Mot de passe actuel</label>
                        <div className="relative">
                            <Input
                                type={showCurrent ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                disabled={isSubmitting}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ivory transition-colors"
                            >
                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-ivory font-body block mb-1">Nouveau mot de passe</label>
                        <div className="relative">
                            <Input
                                type={showNew ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={isSubmitting}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ivory transition-colors"
                            >
                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {newPassword.length > 0 && (
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-xs text-muted">Force :</span>
                                <span className={strength.color}>{strength.label}</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-ivory font-body block mb-1">Confirmer le nouveau mot de passe</label>
                        <div className="relative">
                            <Input
                                type={showConfirm ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isSubmitting}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ivory transition-colors"
                            >
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-sm text-danger">{error}</p>}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button variant="primary" size="lg" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Modification...' : 'Modifier le mot de passe'}
                        </Button>
                        <Button variant="ghost" size="lg" onClick={() => navigate('/settings')}>
                            Annuler
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}