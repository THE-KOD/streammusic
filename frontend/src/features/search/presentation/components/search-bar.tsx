import { Input } from '../../../../shared/components/input'
import { Button } from '../../../../shared/components/button'

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
    onSearch: () => void
    isLoading?: boolean
}

export function SearchBar({ value, onChange, onSearch, isLoading }: SearchBarProps) {
    return (
        <div className="flex gap-2 mb-4">
            <Input
                type="text"
                placeholder="Rechercher un titre, artiste ou album..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                className="flex-1"
            />
            <Button variant="primary" size="md" onClick={onSearch} disabled={isLoading}>
                Rechercher
            </Button>
        </div>
    )
}