// features/upload/presentation/components/select-field.tsx
import { ChevronDown, Check } from 'lucide-react'
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
    value?: string
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
            <label className="font-body text-sm text-ivory flex items-center gap-1">
                {label}
                {required && <span className="text-danger text-xs font-medium">*</span>}
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
                    disabled={disabled || isLoading}
                    className={clsx(
                        'w-full bg-surface text-ivory rounded-lg px-3.5 py-2.5 text-sm text-left',
                        'border transition-all duration-150',
                        'focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/30',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'flex items-center justify-between gap-2',
                        error ? 'border-danger focus:border-danger focus:ring-danger/30' : 'border-white/10',
                        !selected && !error && 'text-muted'
                    )}
                >
                    <span className="truncate">{selected ? selected.name : placeholder}</span>
                    <ChevronDown className={clsx(
                        'w-4 h-4 text-muted transition-transform duration-200 shrink-0',
                        isOpen && 'rotate-180'
                    )} />
                </button>

                {isOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-surface border border-white/10 rounded-lg shadow-xl max-h-56 overflow-y-auto z-20 animate-fade-in">
                        {isLoading ? (
                            <div className="px-4 py-3 text-sm text-muted text-center">Chargement...</div>
                        ) : options.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-muted text-center">Aucune option disponible</div>
                        ) : (
                            options.map(opt => {
                                const isSelected = opt.id === value
                                return (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => { onChange(opt.id); setIsOpen(false) }}
                                        className={clsx(
                                            'w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between',
                                            isSelected
                                                ? 'bg-teal/10 text-ivory'
                                                : 'text-ivory hover:bg-surface-raised'
                                        )}
                                    >
                                        <span>{opt.name}</span>
                                        {isSelected && <Check className="w-4 h-4 text-teal" />}
                                    </button>
                                )
                            })
                        )}
                    </div>
                )}
            </div>
            {error && <p className="text-xs text-danger">{error}</p>}
        </div>
    )
}