import { Input } from '../../../../shared/components/input'

export function DurationFilter() {
    return (
        <div>
            <label className="text-sm text-ivory font-body block mb-1">Durée</label>
            <div className="flex gap-2">
                <Input type="number" placeholder="Min" className="flex-1" />
                <Input type="number" placeholder="Max" className="flex-1" />
            </div>
        </div>
    )
}