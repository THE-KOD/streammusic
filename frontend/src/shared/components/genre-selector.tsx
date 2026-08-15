import { Check } from 'lucide-react'
import clsx from 'clsx'

interface GenreSelectorProps {
    genres: string[]
    selected: string[]
    onChange: (selected: string[]) => void
    disabled?: boolean
}

export function GenreSelector({ genres, selected, onChange, disabled }: GenreSelectorProps) {
    const toggleGenre = (genre: string) => {
        if (disabled) return
        const newSelected = selected.includes(genre)
            ? selected.filter(g => g !== genre)
            : [...selected, genre]
        onChange(newSelected)
    }

    return (
        <div className="flex flex-wrap gap-2">
            {genres.map((genre) => {
                const isSelected = selected.includes(genre)
                return (
                    <button
                        key={genre}
                        type="button"
                        onClick={() => toggleGenre(genre)}
                        disabled={disabled}
                        className={clsx(
                            'px-3 py-1.5 rounded-lg text-sm font-body transition-colors',
                            isSelected
                                ? 'bg-teal/20 text-teal border border-teal/50'
                                : 'bg-surface-raised text-ivory border border-white/10 hover:bg-surface',
                            disabled && 'opacity-50 cursor-not-allowed'
                        )}
                    >
            <span className="flex items-center gap-1.5">
              {isSelected && <Check className="w-3.5 h-3.5" />}
                {genre}
            </span>
                    </button>
                )
            })}
        </div>
    )
}