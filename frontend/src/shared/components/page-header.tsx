// shared/components/page-header.tsx
import { ArrowLeft } from 'lucide-react'
import { Button } from './button'
import { useNavigate } from 'react-router'

interface PageHeaderProps {
    title: string
    subtitle?: string
    backTo?: string
    onBack?: () => void
}

export function PageHeader({ title, subtitle, backTo, onBack }: PageHeaderProps) {
    const navigate = useNavigate()

    const handleBack = () => {
        if (onBack) onBack()
        else if (backTo) navigate(backTo)
        else navigate(-1)
    }

    return (
        <div className="relative p-6 rounded-xl bg-gradient-to-br from-surface to-surface-raised border border-white/5 overflow-hidden mb-8">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber/10 rounded-full blur-2xl" />
            <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-teal/10 rounded-full blur-2xl" />
            <div className="relative flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={handleBack} aria-label="Retour" className="shrink-0">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="font-display text-2xl md:text-3xl font-semibold text-ivory">{title}</h1>
                    {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
                </div>
            </div>
        </div>
    )
}