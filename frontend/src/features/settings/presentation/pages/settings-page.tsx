// features/settings/presentation/pages/settings-page.tsx
import { useNavigate } from 'react-router'
import { PageHeader } from '../../../../shared/components/page-header'
import { SettingsRow } from '../components/settings-row'
import { Button } from '../../../../shared/components/button'
import { useState } from 'react'
import { Modal } from '../../../../shared/components/modal'
import { useSubscription } from '../../../subscriptions'
import { User, Settings, Lock, Shield, Star, LogOut } from 'lucide-react'

export function SettingsPage() {
    const navigate = useNavigate()
    const { isPremium } = useSubscription()
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

    const handleLogout = () => navigate('/login')

    return (
        <div className="space-y-8">
            <PageHeader title="Paramètres" subtitle="Gérez votre compte et vos préférences" />

            <div className="space-y-6">
                {/* Compte */}
                <div>
                    <h6 className="text-xs font-semibold uppercase tracking-wider text-muted/60 font-body mb-2 px-1">
                        Compte
                    </h6>
                    <div className="bg-surface/40 backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
                        <SettingsRow
                            icon={<User className="w-4 h-4" />}
                            title="Profil"
                            description="Modifier vos informations personnelles"
                            onClick={() => navigate('/profile')}
                        />
                        <Divider />
                        <SettingsRow
                            icon={<Settings className="w-4 h-4" />}
                            title="Préférences"
                            description="Gérer vos genres musicaux"
                            onClick={() => navigate('/settings/preferences')}
                        />
                    </div>
                </div>

                {/* Sécurité */}
                <div>
                    <h6 className="text-xs font-semibold uppercase tracking-wider text-muted/60 font-body mb-2 px-1">
                        Sécurité
                    </h6>
                    <div className="bg-surface/40 backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
                        <SettingsRow
                            icon={<Lock className="w-4 h-4" />}
                            title="Mot de passe"
                            description="Modifier votre mot de passe"
                            onClick={() => navigate('/settings/password')}
                        />
                        <Divider />
                        <SettingsRow
                            icon={<Shield className="w-4 h-4" />}
                            title="Sessions et sécurité"
                            description="Gérer vos sessions actives"
                            status="Bientôt"
                            onClick={() => {}}
                        />
                    </div>
                </div>

                {/* Abonnement */}
                <div>
                    <h6 className="text-xs font-semibold uppercase tracking-wider text-muted/60 font-body mb-2 px-1">
                        Abonnement
                    </h6>
                    <div className="bg-surface/40 backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
                        <SettingsRow
                            icon={<Star className="w-4 h-4" />}
                            title="Premium"
                            description={isPremium ? "Vous bénéficiez de l'offre Premium" : "Passez à Premium pour plus d'avantages"}
                            status={isPremium ? 'ACTIF' : 'GRATUIT'}
                            statusColor={isPremium ? 'text-amber' : 'text-muted'}
                            onClick={() => navigate('/premium')}
                        />
                    </div>
                </div>

                {/* Déconnexion */}
                <div className="pt-2">
                    <Button
                        variant="danger"
                        size="md"
                        className="w-full sm:w-auto"
                        onClick={() => setIsLogoutModalOpen(true)}
                    >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                    </Button>
                </div>
            </div>

            {/* Modal de déconnexion */}
            <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} title="Se déconnecter ?">
                <div className="flex flex-col gap-5">
                    <p className="text-sm text-muted">
                        Voulez-vous vraiment vous déconnecter de votre compte StreamMusic ?
                    </p>
                    <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                        <Button variant="ghost" size="md" onClick={() => setIsLogoutModalOpen(false)}>
                            Annuler
                        </Button>
                        <Button variant="danger" size="md" onClick={handleLogout}>
                            Se déconnecter
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

// Divider interne
function Divider() {
    return <hr className="border-white/5 mx-3" />
}