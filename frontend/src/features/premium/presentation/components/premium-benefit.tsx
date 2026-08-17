// features/premium/presentation/components/premium-benefit.tsx
interface PremiumBenefitProps {
    icon: React.ReactNode
    title: string
    description: string
}

export function PremiumBenefit({ icon, title, description }: PremiumBenefitProps) {
    return (
        <div className="flex gap-4 items-start p-4 rounded-xl bg-surface/30 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all duration-200 group">
            <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center text-amber shrink-0 group-hover:bg-amber/20 transition-colors">
                {icon}
            </div>
            <div>
                <h4 className="font-body text-sm font-medium text-ivory">{title}</h4>
                <p className="text-xs text-muted mt-0.5">{description}</p>
            </div>
        </div>
    )
}