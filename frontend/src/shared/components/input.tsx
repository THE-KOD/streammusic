// src/shared/components/input.tsx
import { type InputHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className, id, ...props }, ref) => {
        const inputId = id ?? props.name

        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label htmlFor={inputId} className="font-body text-sm text-ivory font-medium">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={clsx(
                        'bg-surface text-ivory placeholder:text-muted/70 rounded-lg px-3.5 py-2.5 text-sm',
                        'border border-white/10 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/30',
                        'transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
                        error && 'border-danger focus:border-danger focus:ring-danger/30',
                        className,
                    )}
                    {...props}
                />
                {error ? (
                    <p className="text-xs text-danger font-medium mt-0.5">{error}</p>
                ) : helperText ? (
                    <p className="text-xs text-muted/70 mt-0.5">{helperText}</p>
                ) : null}
            </div>
        )
    },
)

Input.displayName = 'Input'