// features/search/presentation/components/filter-panel.tsx
import { Card } from '../../../../shared/components/card'
import { Button } from '../../../../shared/components/button'
import { useGenreOptions } from '../hooks/use-genre-options'
import type { SearchFilters } from '../../domain/search.types'

interface FilterPanelProps {
    filters: SearchFilters
    onFiltersChange: (filters: SearchFilters) => void
    onReset: () => void
}

// Classe commune pour tous les champs (reprise du design initial)
const inputClass =
    'bg-surface text-ivory rounded-lg px-3.5 py-2.5 text-sm border border-white/10 focus:border-teal focus:ring-2 focus:ring-teal/30 transition-all duration-200'

export function FilterPanel({ filters, onFiltersChange, onReset }: FilterPanelProps) {
    const genres = useGenreOptions()

    // Vérifie si au moins un filtre est actif
    const hasActiveFilters =
        filters.genreId !== undefined ||
        filters.dureeMin !== undefined ||
        filters.dureeMax !== undefined

    return (
        <Card className="mb-6 border border-white/5">
            <div className="space-y-4">
                {/* Sélecteur de genre */}
                <div>
                    <label htmlFor="genre-select" className="text-sm font-medium text-ivory block mb-1.5">
                        Genre
                    </label>
                    <select
                        id="genre-select"
                        value={filters.genreId ?? ''}
                        onChange={(e) =>
                            onFiltersChange({
                                ...filters,
                                genreId: e.target.value || undefined,
                            })
                        }
                        className={`w-full ${inputClass}`}
                    >
                        <option value="">Tous les genres</option>
                        {genres.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.nom}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtres de durée */}
                <div>
                    <label className="text-sm font-medium text-ivory block mb-1.5">
                        Durée (secondes)
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.dureeMin ?? ''}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    dureeMin: e.target.value ? Number(e.target.value) : undefined,
                                })
                            }
                            className={`flex-1 ${inputClass}`}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.dureeMax ?? ''}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    dureeMax: e.target.value ? Number(e.target.value) : undefined,
                                })
                            }
                            className={`flex-1 ${inputClass}`}
                        />
                    </div>
                </div>

                {/* Bouton de réinitialisation (visible uniquement si des filtres sont actifs) */}
                {hasActiveFilters && (
                    <div className="flex justify-end">
                        <Button variant="ghost" size="sm" onClick={onReset}>
                            Réinitialiser
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    )
}