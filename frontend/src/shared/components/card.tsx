// src/shared/components/card.tsx
import { type HTMLAttributes } from 'react'
import clsx from 'clsx'

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={clsx(
                'bg-surface rounded-xl p-4 transition-all duration-200',
                'border border-white/5 hover:border-white/10',
                'hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/30',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    )
}