import { create } from 'zustand'

export type ToastVariant = 'success' | 'error' | 'info'

interface ToastItem {
    id: string
    message: string
    variant: ToastVariant
}

interface ToastStore {
    toasts: ToastItem[]
    showToast: (message: string, variant?: ToastVariant) => void
    dismissToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    showToast: (message, variant = 'info') => {
        const id = crypto.randomUUID()
        set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }))
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
        }, 4000)
    },
    dismissToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))