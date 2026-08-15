import { useState } from 'react'
import { PageHeader } from '../../../../shared/components/page-header'
import { Card } from '../../../../shared/components/card'
import { Button } from '../../../../shared/components/button'
import { PremiumBenefit } from '../components/premium-benefit'
import { PlanComparison } from '../components/plan-comparison'
import { useSubscription } from '../../../subscriptions'
import { Star, Music, Volume2, CheckCircle2 } from 'lucide-react'

export function PremiumPage() {
    const { isPremium, startDate, endDate, activatePremium } = useSubscription()
    const [isActivating, setIsActivating] = useState(false)

    const handleActivate = async () => {
        setIsActivating(true)
        try {
            activatePremium()
            await new Promise((resolve) => setTimeout(resolve, 400))
        } finally {
            setIsActivating(false)
        }
    }

    return (
        <div>
            <PageHeader title="Premium" />

            <div className="text-center mb-8">
                <Star className="w-12 h-12 text-amber mx-auto mb-3" />
                <h1 className="font-display text-3xl font-semibold text-ivory">StreamMusic Premium</h1>
                <p className="text-muted mt-1">Une meilleure expérience musicale.</p>
            </div>

            <Card className="mb-6">
                <div className="text-center">
                    <p className="text-sm text-muted">Votre statut</p>
                    <div className="mt-1 flex items-center justify-center gap-2">
                        {isPremium ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 text-amber" />
                                <span className="font-display text-xl font-semibold text-amber">Premium actif</span>
                            </>
                        ) : (
                            <span className="font-display text-xl font-semibold text-ivory">Gratuit</span>
                        )}
                    </div>
                    {isPremium && startDate && endDate && (
                        <div className="mt-2 text-sm text-muted">
                            <p>Date de début : <span className="font-mono">{startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
                            <p>Date de fin : <span className="font-mono">{endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
                        </div>
                    )}
                </div>
            </Card>

            <PlanComparison className="mb-6" />

            <div className="mb-8">
                <h2 className="font-display text-lg font-semibold text-ivory mb-3">Avantages Premium</h2>
                <div className="space-y-4">
                    <PremiumBenefit icon={<Music className="w-5 h-5" />} title="Écoute sans interruption" description="Profitez de votre musique sans interruption." />
                    <PremiumBenefit icon={<Volume2 className="w-5 h-5" />} title="Qualité audio supérieure" description="Profitez d'une meilleure qualité sonore." />
                </div>
            </div>

            {!isPremium ? (
                <Button variant="primary" size="lg" className="w-full md:w-auto" onClick={handleActivate} disabled={isActivating}>
                    {isActivating ? 'Activation...' : 'Activer Premium'}
                </Button>
            ) : (
                <div className="flex items-center justify-center gap-2 text-sm text-muted">
                    <CheckCircle2 className="w-4 h-4 text-teal" />
                    <p>Abonnement Premium actif</p>
                </div>
            )}

            <p className="text-xs text-muted text-center mt-6">V2 : téléchargement hors-ligne</p>
        </div>
    )
}