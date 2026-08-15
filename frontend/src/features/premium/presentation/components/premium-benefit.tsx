interface PremiumBenefitProps {
    icon: React.ReactNode
    title: string
    description: string
}

export function PremiumBenefit({ icon, title, description }: PremiumBenefitProps) {
    return (
        <div className="flex gap-3 items-start">
            <span className="text-amber mt-0.5">{icon}</span>
            <div>
                <h4 className="font-body text-sm font-medium text-ivory">{title}</h4>
                <p className="text-xs text-muted">{description}</p>
            </div>
        </div>
    )
}