import { Card } from '../../../../shared/components/card'
import { Button } from '../../../../shared/components/button'
import type { SearchFilters } from '../../domain/search.entity'

interface FilterPanelProps {
    filters: SearchFilters
    onFiltersChange: (filters: SearchFilters) => void
    onReset: () => void
}

const genres = ['Tous', 'Pop', 'Hip-Hop', 'Afrobeat', 'Rock', 'Jazz']
const inputClass = 'bg-surface text-ivory rounded-lg px-3.5 py-2.5 text-sm border border-white/10 focus:border-teal focus:ring-1 focus:ring-teal transition-colors'

export function FilterPanel({ filters, onFiltersChange, onReset }: FilterPanelProps) {
    return (
        <Card className="mb-6">
            <div className="space-y-4">
                <div>
                    <label className="text-sm text-ivory font-body block mb-1">Genre</label>
                    <select
                        value={filters.genre ?? 'Tous'}
                        onChange={(e) => onFiltersChange({ ...filters, genre: e.target.value })}
                        className={`w-full ${inputClass}`}
                    >
                        {genres.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <div className="flex gap-2">
                    <input type="number" placeholder="Durée min (s)" value={filters.minDuration ?? ''}
                           onChange={(e) => onFiltersChange({ ...filters, minDuration: Number(e.target.value) || undefined })}
                           className={`flex-1 ${inputClass}`} />
                    <input type="number" placeholder="Durée max (s)" value={filters.maxDuration ?? ''}
                           onChange={(e) => onFiltersChange({ ...filters, maxDuration: Number(e.target.value) || undefined })}
                           className={`flex-1 ${inputClass}`} />
                </div>
                <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={onReset}>Réinitialiser</Button>
                </div>
            </div>
        </Card>
    )
}