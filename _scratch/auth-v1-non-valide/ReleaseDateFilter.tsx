import { Input } from '../../../../shared/components/input'

export function ReleaseDateFilter() {
    return (
        <div>
            <label className="text-sm text-ivory font-body block mb-1">Date de sortie</label>
            <div className="flex gap-2">
                <Input type="date" placeholder="Du" className="flex-1" />
                <Input type="date" placeholder="Au" className="flex-1" />
            </div>
        </div>
    )
}