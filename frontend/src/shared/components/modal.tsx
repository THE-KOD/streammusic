import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(event) => event.stopPropagation()}
                className="bg-surface rounded-xl w-full max-w-md p-6 shadow-xl"
            >
                <div className="flex items-center justify-between mb-4">
                    {title && <h2 className="font-display text-lg text-ivory">{title}</h2>}
                    <button onClick={onClose} aria-label="Fermer" className="text-muted hover:text-ivory transition-colors ml-auto">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>,
        document.body,
    )
}