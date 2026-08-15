import { ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'

interface Option {
    id: string
    name: string
}

interface SelectFieldProps {
    label: string
    required?: boolean
    options: Option[]
    value?: string // option id
    onChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
    error?: string
    isLoading?: boolean
}

export function SelectField({
                                label,
                                required = false,
                                options,
                                value,
                                onChange,
                                placeholder = 'Sélectionner...',
                                disabled = false,
                                error,
                                isLoading = false,
                            }: SelectFieldProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const selected = options.find(opt => opt.id === value)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="flex flex-col gap-1.5" ref={containerRef}>
            <label className="font-body text-sm text-ivory">
                {label} {required && '*'}
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
                    disabled={disabled || isLoading}
                    className={clsx(
                        'w-full bg-surface text-ivory rounded-lg px-3.5 py-2.5 text-sm',
                        'border border-white/10 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal',
                        'transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
                        'flex items-center justify-between',
                        error && 'border-danger focus:border-danger focus:ring-danger',
                        !selected && 'text-muted'
                    )}
                >
                    <span>{selected ? selected.name : placeholder}</span>
                    <ChevronDown className={clsx('w-4 h-4 text-muted transition-transform', isOpen && 'rotate-180')} />
                </button>
                {isOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-surface border border-white/10 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                        {isLoading ? (
                            <div className="px-4 py-2 text-sm text-muted">Chargement...</div>
                        ) : options.length === 0 ? (
                            <div className="px-4 py-2 text-sm text-muted">Aucune option</div>
                        ) : (
                            options.map(opt => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => { onChange(opt.id); setIsOpen(false) }}
                                    className="w-full text-left px-4 py-2 text-sm text-ivory hover:bg-surface-raised transition-colors"
                                >
                                    {opt.name}
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
            {error && <p className="text-xs text-danger">{error}</p>}
        </div>
    )
}