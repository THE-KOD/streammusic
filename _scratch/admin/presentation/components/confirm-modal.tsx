// features/admin/presentation/components/confirm-modal.tsx
import { Modal } from '../../../../shared/components/modal'
import { Button } from '../../../../shared/components/button'
import { AlertTriangle, CheckCircle } from 'lucide-react'

interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    message: string
    confirmLabel: string
    confirmVariant: 'primary' | 'danger' | 'secondary'
    onConfirm: () => void
    isLoading?: boolean
}

export function ConfirmModal({
                                 isOpen,
                                 onClose,
                                 title,
                                 message,
                                 confirmLabel,
                                 confirmVariant = 'danger',
                                 onConfirm,
                                 isLoading = false,
                             }: ConfirmModalProps) {
    const iconMap = {
        primary: <CheckCircle className="w-6 h-6 text-teal" />,
        danger: <AlertTriangle className="w-6 h-6 text-danger" />,
        secondary: <AlertTriangle className="w-6 h-6 text-amber" />,
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col items-center text-center gap-4 py-2">
                <div className="p-3 rounded-full bg-surface-raised border border-white/5">
                    {iconMap[confirmVariant]}
                </div>
                <h2 className="font-display text-xl font-semibold text-ivory">{title}</h2>
                <p className="text-sm text-muted max-w-sm">{message}</p>
                <div className="flex justify-center gap-3 mt-2 w-full">
                    <Button variant="secondary" size="md" onClick={onClose} disabled={isLoading} className="flex-1">
                        Annuler
                    </Button>
                    <Button variant={confirmVariant} size="md" onClick={onConfirm} disabled={isLoading} className="flex-1">
                        {isLoading ? '...' : confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}