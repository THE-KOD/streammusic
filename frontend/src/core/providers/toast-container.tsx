import { useToastStore } from '../store/toast-store'
import { Toast } from '../../shared/components/toast'

export function ToastContainer() {
    const toasts = useToastStore((state) => state.toasts)
    const dismissToast = useToastStore((state) => state.dismissToast)

    return (
        <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    variant={toast.variant}
                    onDismiss={() => dismissToast(toast.id)}
                />
            ))}
        </div>
    )
}