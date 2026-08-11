interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg'
}

const heights = {
    sm: 'h-3',
    md: 'h-5',
    lg: 'h-8',
}

export function Spinner({ size = 'md' }: SpinnerProps) {
    return (
        <div className={`flex items-end gap-0.5 ${heights[size]}`} role="status" aria-label="Chargement">
            <span className="w-1 bg-amber rounded-full animate-[eq_0.8s_ease-in-out_infinite]" style={{ height: '60%', animationDelay: '0ms' }} />
            <span className="w-1 bg-amber rounded-full animate-[eq_0.8s_ease-in-out_infinite]" style={{ height: '100%', animationDelay: '150ms' }} />
            <span className="w-1 bg-amber rounded-full animate-[eq_0.8s_ease-in-out_infinite]" style={{ height: '45%', animationDelay: '300ms' }} />
        </div>
    )
}