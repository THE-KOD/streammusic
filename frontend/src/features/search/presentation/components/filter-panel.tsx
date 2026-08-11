import { Card } from '../../../../shared/components/card'
import { Button } from '../../../../shared/components/button'
import { GenreFilter } from './GenreFilter'
import { DurationFilter } from './DurationFilter'
import { ReleaseDateFilter } from './ReleaseDateFilter'

interface FilterPanelProps {
    onReset: () => void
}

export function FilterPanel({ onReset }: FilterPanelProps) {
    return (
        <Card className="mb-6">
            <div className="space-y-4">
                <GenreFilter />
                <DurationFilter />
                <ReleaseDateFilter />
                <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={onReset}>
                        Réinitialiser
                    </Button>
                </div>
            </div>
        </Card>
    )
}