// features/premium/presentation/components/plan-comparison.tsx
import { Check, X } from 'lucide-react'
import clsx from 'clsx'

interface PlanComparisonProps {
    className?: string
}

export function PlanComparison({ className }: PlanComparisonProps) {
    return (
        <div className={clsx('grid grid-cols-1 sm:grid-cols-2 gap-4', className)}>
            {/* Plan Gratuit */}
            <div className="bg-surface/40 backdrop-blur-sm rounded-xl p-5 border border-white/5 transition-all duration-200 hover:border-white/10">
                <div className="text-center">
                    <h3 className="font-display text-sm font-semibold text-muted">GRATUIT</h3>
                    <p className="text-2xl font-display text-ivory mt-1">0 €</p>
                    <p className="text-xs text-muted">Basique</p>
                </div>
                <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2.5 text-sm text-ivory font-body">
                        <Check className="w-4 h-4 text-teal shrink-0" />
                        Écoute standard
                    </li>
                    <li className="flex items-center gap-2.5 text-sm text-ivory font-body">
                        <Check className="w-4 h-4 text-teal shrink-0" />
                        Fonctionnalités de base
                    </li>
                    <li className="flex items-center gap-2.5 text-sm text-muted/50 font-body">
                        <X className="w-4 h-4 text-muted/30 shrink-0" />
                        Écoute sans interruption
                    </li>
                    <li className="flex items-center gap-2.5 text-sm text-muted/50 font-body">
                        <X className="w-4 h-4 text-muted/30 shrink-0" />
                        Qualité audio supérieure
                    </li>
                </ul>
            </div>

            {/* Plan Premium */}
            <div className="bg-surface-raised rounded-xl p-5 border border-amber/30 ring-1 ring-amber/10 transition-all duration-200 hover:border-amber/50 relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber/5 rounded-full blur-xl" />
                <div className="relative">
                    <div className="text-center">
                        <h3 className="font-display text-sm font-semibold text-amber">PREMIUM</h3>
                        <p className="text-2xl font-display text-ivory mt-1">Simulé</p>
                        <p className="text-xs text-muted">Gratuit pour la démo</p>
                    </div>
                    <ul className="mt-4 space-y-2">
                        <li className="flex items-center gap-2.5 text-sm text-ivory font-body">
                            <Check className="w-4 h-4 text-amber shrink-0" />
                            Écoute sans interruption
                        </li>
                        <li className="flex items-center gap-2.5 text-sm text-ivory font-body">
                            <Check className="w-4 h-4 text-amber shrink-0" />
                            Qualité audio supérieure
                        </li>
                        <li className="flex items-center gap-2.5 text-sm text-ivory font-body">
                            <Check className="w-4 h-4 text-amber shrink-0" />
                            Téléchargement hors-ligne (V2)
                        </li>
                        <li className="flex items-center gap-2.5 text-sm text-ivory font-body">
                            <Check className="w-4 h-4 text-amber shrink-0" />
                            Recommandations avancées (V2)
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}