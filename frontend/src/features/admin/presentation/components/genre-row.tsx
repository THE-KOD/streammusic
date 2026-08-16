// features/admin/presentation/components/genre-row.tsx
import { Button } from '../../../../shared/components/button'
import { Pencil, Trash2 } from 'lucide-react'

interface GenreRowProps {
    name: string
    onEdit: () => void
    onDelete: () => void
}

export function GenreRow({ name, onEdit, onDelete }: GenreRowProps) {
    return (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-surface-raised/50 transition-all duration-200 group border border-transparent hover:border-white/5">
            <span className="font-body text-ivory font-medium">{name}</span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={onEdit} className="text-muted hover:text-ivory">
                    <Pencil className="w-3.5 h-3.5" />
                    <span className="sr-only">Modifier</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={onDelete} className="text-muted hover:text-danger">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="sr-only">Supprimer</span>
                </Button>
            </div>
        </div>
    )
}