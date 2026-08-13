import { Check } from 'lucide-react'
import clsx from 'clsx'

interface PlanComparisonProps {
    className?: string
}

export function PlanComparison({ className }: PlanComparisonProps) {
    return (
        <div className={clsx('grid grid-cols-1 md:grid-cols-2 gap-4', className)}>
            <div className="bg-surface/50 rounded-xl p-4 border border-white/5">
                <h3 className="font-display text-sm font-semibold text-muted text-center">GRATUIT</h3>
                <ul className="mt-3 space-y-1.5">
                    <li className="flex items-center gap-2 text-sm text-ivory font-body">
                        <Check className="w-4 h-4 text-teal" /> Écoute standard
                    </li>
                    <li className="flex items-center gap-2 text-sm text-ivory font-body">
                        <Check className="w-4 h-4 text-teal" /> Fonctionnalités de base
                    </li>
                </ul>
            </div>
            <div className="bg-surface-raised rounded-xl p-4 border border-amber/20 ring-1 ring-amber/10">
                <h3 className="font-display text-sm font-semibold text-amber text-center">PREMIUM</h3>
                <ul className="mt-3 space-y-1.5">
                    <li className="flex items-center gap-2 text-sm text-ivory font-body">
                        <Check className="w-4 h-4 text-amber" /> Écoute sans interruption
                    </li>
                    <li className="flex items-center gap-2 text-sm text-ivory font-body">
                        <Check className="w-4 h-4 text-amber" /> Qualité audio supérieure
                    </li>
                </ul>
            </div>
        </div>
    )
}