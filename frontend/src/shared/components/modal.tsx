// src/shared/components/modal.tsx
import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import clsx from 'clsx'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            document.body.style.overflow = 'hidden'
        } else {
            // attendre la fin de l'animation avant de retirer du DOM
            const timer = setTimeout(() => setIsVisible(false), 250)
            document.body.style.overflow = ''
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }
        if (isOpen) document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    if (!isVisible && !isOpen) return null

    return createPortal(
        <div
            className={clsx(
                'fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200',
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
            )}
            style={{ background: 'rgba(20,24,31,0.75)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(e) => e.stopPropagation()}
                className={clsx(
                    'bg-surface rounded-xl w-full max-w-md p-6 shadow-2xl border border-white/5',
                    'transition-all duration-250 ease-out',
                    isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
                )}
            >
                <div className="flex items-center justify-between mb-5">
                    {title && <h2 className="font-display text-xl text-ivory">{title}</h2>}
                    <button
                        onClick={onClose}
                        aria-label="Fermer"
                        className="text-muted hover:text-ivory transition-colors ml-auto p-1 rounded-full hover:bg-surface-raised"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>,
        document.body,
    )
}