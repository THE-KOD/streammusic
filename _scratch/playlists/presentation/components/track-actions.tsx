import { MoreVertical } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Button } from '../../../../shared/components/button'

interface TrackActionsProps {
    onPlay: () => void
    onRemove: () => void
}

export function TrackActions({ onPlay, onRemove }: TrackActionsProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={menuRef}>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Actions du titre"
                className="text-muted hover:text-ivory"
            >
                <MoreVertical className="w-4 h-4" />
            </Button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 bg-surface border border-white/10 rounded-lg shadow-lg py-1 min-w-[160px] z-10">
                    <button
                        onClick={() => { onPlay(); setIsOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-ivory hover:bg-surface-raised transition-colors"
                    >
                        Lire
                    </button>
                    <button
                        onClick={() => { onRemove(); setIsOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-surface-raised transition-colors"
                    >
                        Retirer de la playlist
                    </button>
                </div>
            )}
        </div>
    )
}