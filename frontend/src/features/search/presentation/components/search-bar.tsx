// features/search/presentation/components/search-bar.tsx
import { Input } from '../../../../shared/components/input'
import { Button } from '../../../../shared/components/button'
import { Search } from 'lucide-react'

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
    onSearch: () => void
    isLoading?: boolean
}

export function SearchBar({ value, onChange, onSearch, isLoading }: SearchBarProps) {
    return (
        <div className="bg-surface/40 backdrop-blur-sm rounded-xl p-4 border border-white/5 mb-6 animate-fade-in">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <Input
                        type="text"
                        placeholder="Rechercher un titre, un artiste ou un album..."
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                        className="pl-9"
                    />
                </div>
                <Button variant="primary" size="md" onClick={onSearch} disabled={isLoading}>
                    {isLoading ? 'Recherche...' : 'Rechercher'}
                </Button>
            </div>
        </div>
    )
}