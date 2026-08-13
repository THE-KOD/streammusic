import { ArrowLeft } from 'lucide-react'
import { Button } from '../frontend/src/shared/components/button'
import { useNavigate } from 'react-router'

interface PageHeaderProps {
    title: string
    backTo?: string
    onBack?: () => void
}

export function PageHeader({ title, backTo, onBack }: PageHeaderProps) {
    const navigate = useNavigate()

    const handleBack = () => {
        if (onBack) {
            onBack()
        } else if (backTo) {
            navigate(backTo)
        } else {
            navigate(-1)
        }
    }

    return (
        <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={handleBack} aria-label="Retour">
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-display text-2xl font-semibold text-ivory">{title}</h1>
        </div>
    )
}