interface AuthErrorBannerProps {
    message?: string
}

export function AuthErrorBanner({ message }: AuthErrorBannerProps) {
    if (!message) return null
    return (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
            <span className="font-bold">⚠</span>
            <span>{message}</span>
        </div>
    )
}