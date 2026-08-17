// features/search/presentation/components/filter-panel.tsx
import { Card } from '../../../../shared/components/card'
import { Button } from '../../../../shared/components/button'
import type { SearchFilters } from '../../domain/search.entity'

interface FilterPanelProps {
    filters: SearchFilters
    onFiltersChange: (filters: SearchFilters) => void
    onReset: () => void
}

const genres = ['Tous', 'Pop', 'Hip-Hop', 'Afrobeat', 'Rock', 'Jazz']
const inputClass =
    'bg-surface text-ivory rounded-lg px-3.5 py-2.5 text-sm border border-white/10 focus:border-teal focus:ring-2 focus:ring-teal/30 transition-all duration-200'

export function FilterPanel({ filters, onFiltersChange, onReset }: FilterPanelProps) {
    return (
        <Card className="mb-6 border border-white/5">
            <div className="space-y-4">
                <div>
                    <label htmlFor="genre-select" className="text-sm font-medium text-ivory block mb-1.5">
                        Genre
                    </label>
                    <select
                        id="genre-select"
                        value={filters.genre ?? 'Tous'}
                        onChange={(e) => onFiltersChange({ ...filters, genre: e.target.value === 'Tous' ? undefined : e.target.value })}
                        className={`w-full ${inputClass}`}
                    >
                        {genres.map((g) => (
                            <option key={g} value={g}>
                                {g}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium text-ivory block mb-1.5">Durée (secondes)</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.minDuration ?? ''}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    minDuration: e.target.value ? Number(e.target.value) : undefined,
                                })
                            }
                            className={`flex-1 ${inputClass}`}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxDuration ?? ''}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    maxDuration: e.target.value ? Number(e.target.value) : undefined,
                                })
                            }
                            className={`flex-1 ${inputClass}`}
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={onReset}>
                        Réinitialiser
                    </Button>
                </div>
            </div>
        </Card>
    )
}