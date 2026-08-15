import { useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '../../../../shared/components/page-header'
import { Input } from '../../../../shared/components/input'
import { Button } from '../../../../shared/components/button'
import { Card } from '../../../../shared/components/card'
import { LoadingState } from '../../../../shared/components/states'
import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { useUser } from '../../../profile'

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

    if (isLoading) return <LoadingState />
    if (!user) return null

    if (user.authMethod === 'oauth') {
        return (
            <div>
                <PageHeader title="Mot de passe" backTo="/settings" />
                <Card>
                    <div className="flex flex-col items-center text-center gap-4 py-4">
                        <LockKeyhole className="w-12 h-12 text-muted" />
                        <h3 className="font-display text-lg text-ivory">Compte connecté avec Google / OAuth</h3>
                        <p className="text-sm text-muted max-w-sm">La gestion du mot de passe s'effectue auprès de votre fournisseur d'authentification.</p>
                        <Button variant="secondary" size="md" disabled title="Redirection vers le fournisseur OAuth — Phase 4">Gérer mon compte</Button>
                    </div>
                </Card>
            </div>
        )
    }

    const handleSubmit = async () => {
        setError(null)
        if (newPassword !== confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return }
        if (newPassword.length < 8) { setError('Le mot de passe doit faire au moins 8 caractères.'); return }
        setIsSubmitting(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            navigate('/settings')
        } catch {
            setError('Erreur lors du changement de mot de passe.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div>
            <PageHeader title="Mot de passe" backTo="/settings" />
            <div className="space-y-4">
                <div>
                    <h2 className="font-display text-lg text-ivory">Sécurité du compte</h2>
                    <p className="text-sm text-muted">Modifiez votre mot de passe pour sécuriser votre compte.</p>
                </div>
                <div className="space-y-3">
                    <div>
                        <label className="text-sm text-ivory font-body block mb-1">Mot de passe actuel</label>
                        <div className="relative">
                            <Input type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} disabled={isSubmitting} className="pr-10" />
                            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ivory">
                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-ivory font-body block mb-1">Nouveau mot de passe</label>
                        <div className="relative">
                            <Input type={showNew ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isSubmitting} className="pr-10" />
                            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ivory">
                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-ivory font-body block mb-1">Confirmer le nouveau mot de passe</label>
                        <div className="relative">
                            <Input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isSubmitting} className="pr-10" />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ivory">
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-sm text-danger">{error}</p>}
                    <Button variant="primary" size="lg" onClick={handleSubmit} disabled={isSubmitting} className="w-full md:w-auto">
                        {isSubmitting ? 'Modification...' : 'Modifier le mot de passe'}
                    </Button>
                </div>
            </div>
        </div>
    )
}