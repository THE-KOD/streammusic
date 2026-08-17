// src/shared/components/button.tsx
import { type ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-amber text-ink hover:brightness-110 font-medium shadow-sm shadow-amber/10',
    secondary: 'bg-surface-raised text-ivory hover:bg-surface border border-white/10 shadow-sm',
    ghost: 'bg-transparent text-muted hover:text-ivory',
    danger: 'bg-danger text-ivory hover:brightness-110 font-medium shadow-sm shadow-danger/10',
}

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'text-sm px-3 py-1.5 rounded-md',
    md: 'text-sm px-4 py-2.5 rounded-lg',
    lg: 'text-base px-6 py-3 rounded-lg',
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
    return (
        <button
            className={clsx(
                'font-body inline-flex items-center justify-center gap-2 transition-all duration-150',
                'disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal focus-visible:outline-offset-2',
                variantClasses[variant],
                sizeClasses[size],
                className,
            )}
            {...props}
        />
    )
}