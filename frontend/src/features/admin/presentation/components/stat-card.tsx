// features/admin/presentation/components/stat-card.tsx
import { Card } from '../../../../shared/components/card'
import { Users } from 'lucide-react'

interface StatCardProps {
    label: string
    value: number | string
    icon?: React.ReactNode
    trend?: {
        value: number
        direction: 'up' | 'down'
    }
}

export function StatCard({ label, value, icon, trend }: StatCardProps) {
    return (
        <Card className="relative overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-200 hover:shadow-lg hover:shadow-ink/30">
            <div className="absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 rounded-full bg-amber/5" />
            <div className="flex items-start justify-between">
                <div>
                    <p className="font-body text-xs font-medium text-muted uppercase tracking-wider">{label}</p>
                    <p className="font-mono text-3xl font-semibold text-ivory mt-1 tracking-tight">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                    {trend && (
                        <p className={`text-xs font-body mt-1 ${trend.direction === 'up' ? 'text-teal' : 'text-danger'}`}>
                            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
                        </p>
                    )}
                </div>
                <div className="p-2.5 rounded-xl bg-surface-raised border border-white/5 text-muted">
                    {icon || <Users className="w-5 h-5" />}
                </div>
            </div>
        </Card>
    )
}