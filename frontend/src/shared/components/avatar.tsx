interface AvatarProps {
    src?: string
    name: string
    size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-16 h-16 text-lg',
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
    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={`${sizeClasses[size]} rounded-full object-cover`}
            />
        )
    }

    return (
        <div
            className={`${sizeClasses[size]} rounded-full bg-surface-raised text-ivory font-display flex items-center justify-center`}
        >
            {getInitials(name)}
        </div>
    )
}