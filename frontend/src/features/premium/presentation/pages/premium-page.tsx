// features/premium/presentation/pages/premium-page.tsx
import { useState } from 'react'
import { PageHeader } from '../../../../shared/components/page-header'
import { Card } from '../../../../shared/components/card'
import { Button } from '../../../../shared/components/button'
import { PremiumBenefit } from '../components/premium-benefit'
import { PlanComparison } from '../components/plan-comparison'
import { useSubscription } from '../../../subscriptions'
import { Star, Music, Volume2, CheckCircle2, Crown, Sparkles } from 'lucide-react'

export function PremiumPage() {
    const { isPremium, startDate, endDate, activatePremium } = useSubscription()
    const [isActivating, setIsActivating] = useState(false)

    const handleActivate = async () => {
        setIsActivating(true)
        try {
            activatePremium()
            await new Promise((resolve) => setTimeout(resolve, 600))
        } finally {
            setIsActivating(false)
        }
    }

    return (
        <div className="space-y-8">
            <PageHeader title="Premium" subtitle={isPremium ? "Vous profitez déjà de l'expérience complète" : "Passez à la vitesse supérieure"} />

            {/* Hero */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-amber/10 via-surface-raised to-surface border border-amber/20 overflow-hidden">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber/5 rounded-full blur-3xl" />
                <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-teal/5 rounded-full blur-3xl" />
                <div className="relative text-center">
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-amber/30 blur-2xl rounded-full" />
                            <Crown className="w-16 h-16 text-amber relative z-10" />
                        </div>
                    </div>
                    <h1 className="font-display text-3xl md:text-4xl font-semibold text-ivory">
                        {isPremium ? 'Vous êtes Premium !' : 'StreamMusic Premium'}
                    </h1>
                    <p className="text-muted mt-2 max-w-md mx-auto">
                        {isPremium
                            ? 'Profitez de l\'écoute sans interruption et de la qualité audio supérieure.'
                            : 'Une meilleure expérience musicale vous attend.'}
                    </p>
                </div>
            </div>

            {/* Statut */}
            <Card className="p-5 border border-white/5 bg-surface/40 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-muted">Statut de votre abonnement</p>
                        <div className="flex items-center gap-2 mt-1">
                            {isPremium ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5 text-amber" />
                                    <span className="font-display text-xl font-semibold text-amber">Premium actif</span>
                                </>
                            ) : (
                                <>
                                    <span className="font-display text-xl font-semibold text-ivory">Gratuit</span>
                                    <span className="text-xs text-muted bg-surface-raised px-2 py-0.5 rounded-full">Basique</span>
                                </>
                            )}
                        </div>
                    </div>
                    {!isPremium && (
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleActivate}
                            disabled={isActivating}
                            className="relative overflow-hidden"
                        >
                            {isActivating ? (
                                'Activation...'
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Activer Premium
                                </>
                            )}
                        </Button>
                    )}
                    {isPremium && startDate && endDate && (
                        <div className="text-right text-xs text-muted font-mono">
                            <div>Début : {startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                            <div>Fin : {endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Comparaison */}
            <PlanComparison className="mb-2" />

            {/* Avantages */}
            <div>
                <h2 className="font-display text-lg font-semibold text-ivory mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber" />
                    Avantages Premium
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PremiumBenefit
                        icon={<Music className="w-5 h-5" />}
                        title="Écoute sans interruption"
                        description="Profitez de votre musique sans aucune publicité ni coupure."
                    />
                    <PremiumBenefit
                        icon={<Volume2 className="w-5 h-5" />}
                        title="Qualité audio supérieure"
                        description="Écoutez vos titres en haute qualité pour une expérience immersive."
                    />
                    <PremiumBenefit
                        icon={<CheckCircle2 className="w-5 h-5" />}
                        title="Téléchargement hors-ligne"
                        description="V2 — Écoutez vos titres préférés sans connexion internet."
                    />
                    <PremiumBenefit
                        icon={<Star className="w-5 h-5" />}
                        title="Recommandations avancées"
                        description="V2 — Des suggestions musicales encore plus pertinentes."
                    />
                </div>
            </div>

            <div className="text-center text-xs text-muted/60">
                {isPremium ? '✅ Vous bénéficiez de tous les avantages Premium.' : '⬆️ Passez à Premium pour débloquer ces avantages.'}
            </div>
        </div>
    )
}