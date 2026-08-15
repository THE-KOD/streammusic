import { MoreVertical } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import clsx from 'clsx'
import { Button } from './button'

export interface DropdownMenuItem {
    label: string
    onClick: () => void
    variant?: 'default' | 'danger'
}

interface DropdownMenuProps {
    items: DropdownMenuItem[]
    ariaLabel: string
    trigger?: ReactNode
    align?: 'left' | 'right'
}

export function DropdownMenu({ items, ariaLabel, trigger, align = 'right' }: DropdownMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={menuRef}>
            {trigger ? (
                <button onClick={() => setIsOpen((v) => !v)} aria-label={ariaLabel} aria-haspopup="menu" aria-expanded={isOpen} className="rounded-full">
                    {trigger}
                </button>
            ) : (
                <Button variant="ghost" size="sm" onClick={() => setIsOpen((v) => !v)} aria-label={ariaLabel} aria-haspopup="menu" aria-expanded={isOpen} className="text-muted hover:text-ivory">
                    <MoreVertical className="w-4 h-4" />
                </Button>
            )}
            {isOpen && (
                <div className={clsx('absolute top-full mt-1 bg-surface border border-white/10 rounded-lg shadow-lg py-1 min-w-[180px] z-10', align === 'right' ? 'right-0' : 'left-0')}>
                    {items.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => { item.onClick(); setIsOpen(false) }}
                            className={clsx('w-full text-left px-4 py-2 text-sm hover:bg-surface-raised transition-colors', item.variant === 'danger' ? 'text-danger' : 'text-ivory')}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}