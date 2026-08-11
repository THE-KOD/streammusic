import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import clsx from 'clsx'
import type { ToastVariant } from '../../core/store/toast-store'

interface ToastProps {
    message: string
    variant: ToastVariant
    onDismiss: () => void
}

const variantConfig: Record<ToastVariant, { icon: typeof Info; accent: string }> = {
    success: { icon: CheckCircle2, accent: 'text-teal' },
    error: { icon: XCircle, accent: 'text-danger' },
    info: { icon: Info, accent: 'text-amber' },
}

export function Toast({ message, variant, onDismiss }: ToastProps) {
    const { icon: Icon, accent } = variantConfig[variant]

    return (
        <div className="flex items-center gap-3 bg-surface-raised border border-white/10 rounded-lg px-4 py-3 shadow-lg min-w-[280px]">
            <Icon className={clsx('w-5 h-5 flex-shrink-0', accent)} />
            <p className="font-body text-sm text-ivory flex-1">{message}</p>
            <button onClick={onDismiss} aria-label="Fermer la notification" className="text-muted hover:text-ivory">
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}