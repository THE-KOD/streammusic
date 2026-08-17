import { clsx } from 'clsx' // ou utilise une fonction manuelle si tu préfères

interface AvatarProps {
    src?: string
    name: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-40 h-40 md:w-48 md:h-48 text-5xl',
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
}

export function Avatar({ src, name, size = 'md' }: AvatarProps) {
    // Classes communes aux deux cas
    const baseClasses =
        'rounded-full border border-white/10 transition-transform duration-200 hover:scale-105'

    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={clsx(sizeClasses[size], baseClasses, 'object-cover')}
            />
        )
    }

    return (
        <div
            className={clsx(
                sizeClasses[size],
                baseClasses,
                'bg-surface-raised text-ivory font-display flex items-center justify-center'
            )}
        >
            {getInitials(name)}
        </div>
    )
}