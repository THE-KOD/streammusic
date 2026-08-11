import { type HTMLAttributes } from 'react'
import clsx from 'clsx'

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={clsx(
                'bg-surface rounded-xl p-4 transition-colors duration-150 hover:bg-surface-raised',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    )
}