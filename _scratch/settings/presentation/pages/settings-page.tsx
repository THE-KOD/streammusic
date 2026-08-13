import { useNavigate } from 'react-router'
import { PageHeader } from '../../../../shared/components/page-header'
import { SettingsRow } from '../components/settings-row'
import { Divider } from '../components/divider'
import { Button } from '../../../../shared/components/button'
import { User, Settings, Lock, Shield, Star, LogOut } from 'lucide-react'
import { useState } from 'react'
import { Modal } from '../../../../shared/components/modal'

export function SettingsPage() {
    const navigate = useNavigate()
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

    const handleLogout = () => {
        // Simuler déconnexion
        navigate('/login')
    }

    return (
        <div>
            <PageHeader title="Paramètres" />

            <div className="space-y-4">
                {/* Section COMPTE */}
                <div>
                    <h6 className="text-xs font-semibold uppercase tracking-wide text-muted font-body mb-2">COMPTE</h6>
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
                        description="Gérer vos préférences musicales"
                        onClick={() => navigate('/settings/preferences')}
                    />
                </div>

                {/* Section SÉCURITÉ */}
                <div>
                    <h6 className="text-xs font-semibold uppercase tracking-wide text-muted font-body mb-2">SÉCURITÉ</h6>
                    <SettingsRow
                        icon={<Lock className="w-4 h-4" />}
                        title="Mot de passe"
                        description="Modifier ou réinitialiser votre mot de passe"
                        onClick={() => navigate('/settings/password')}
                    />
                    <Divider />
                    <SettingsRow
                        icon={<Shield className="w-4 h-4" />}
                        title="Sessions et sécurité"
                        description="Gérer la sécurité de votre compte"
                        onClick={() => navigate('/settings/security')}
                    />
                </div>

                {/* Section ABONNEMENT */}
                <div>
                    <h6 className="text-xs font-semibold uppercase tracking-wide text-muted font-body mb-2">ABONNEMENT</h6>
                    <SettingsRow
                        icon={<Star className="w-4 h-4" />}
                        title="Premium"
                        description="Statut : GRATUIT"
                        onClick={() => navigate('/premium')}
                    />
                </div>

                {/* Déconnexion */}
                <div className="pt-4">
                    <Button
                        variant="danger"
                        size="md"
                        className="w-full md:w-auto"
                        onClick={() => setIsLogoutModalOpen(true)}
                    >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                    </Button>
                </div>
            </div>

            {/* Modal de déconnexion */}
            <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)}>
                <div className="flex flex-col gap-4">
                    <h2 className="font-display text-lg text-ivory">Se déconnecter ?</h2>
                    <p className="text-sm text-muted">Voulez-vous vraiment vous déconnecter de votre compte StreamMusic ?</p>
                    <div className="flex justify-end gap-3 mt-2">
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