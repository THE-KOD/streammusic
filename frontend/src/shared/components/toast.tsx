// src/shared/components/toast.tsx
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
        <div
            className={clsx(
                'flex items-center gap-3 bg-surface-raised border border-white/10 rounded-xl px-4 py-3 shadow-lg',
                'min-w-[280px] max-w-md transition-all duration-300 ease-out',
                'animate-slide-up', // définie dans index.css
            )}
        >
            <Icon className={clsx('w-5 h-5 flex-shrink-0', accent)} />
            <p className="font-body text-sm text-ivory flex-1 leading-relaxed">{message}</p>
            <button
                onClick={onDismiss}
                aria-label="Fermer la notification"
                className="text-muted hover:text-ivory transition-colors p-1 rounded-full hover:bg-surface"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}