// features/home/presentation/components/section-header.tsx
import { Button } from '../../../../shared/components/button'
import { Link } from 'react-router'

interface SectionHeaderProps {
    title: string
    subtitle?: string
    seeMoreLink?: string
}

export function SectionHeader({ title, subtitle, seeMoreLink }: SectionHeaderProps) {
    return (
        <div className="flex items-end justify-between mb-4 pb-2 border-b border-white/5">
            <div>
                <h2 className="font-display text-2xl font-semibold text-ivory">{title}</h2>
                {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
            </div>
            {seeMoreLink && (
                <Link to={seeMoreLink}>
                    <Button variant="ghost" size="sm">Voir plus</Button>
                </Link>
            )}
        </div>
    )
}