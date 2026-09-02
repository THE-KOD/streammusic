import { Clock, CheckCircle2, XCircle } from 'lucide-react'
import clsx from 'clsx'
import { formatDuration } from '../../../../shared/utils/format-duration'
import type { MyTrack } from '../../domain/my-track.entity'

const STATUS_CONFIG = {
    EN_ATTENTE: { label: 'En attente', color: 'text-amber bg-amber/10 border-amber/20', icon: Clock },
    VALIDE: { label: 'Validé', color: 'text-teal bg-teal/10 border-teal/20', icon: CheckCircle2 },
    REJETE: { label: 'Rejeté', color: 'text-danger bg-danger/10 border-danger/20', icon: XCircle },
}

export function MyTrackStatusRow({ track }: { track: MyTrack }) {
    const config = STATUS_CONFIG[track.status]
    const Icon = config.icon

    return (
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-raised/60 transition-colors">
            <div className="w-10 h-10 rounded-md overflow-hidden bg-surface-raised flex-shrink-0">
                {track.coverUrl ? <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-surface-raised" />}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-ivory truncate">{track.title}</p>
                <p className="text-xs text-muted">{formatDuration(track.duration)} · {track.playCount} écoute{track.playCount > 1 ? 's' : ''}</p>
            </div>
            <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border', config.color)}>
        <Icon className="w-3 h-3" />
                {config.label}
      </span>
        </div>
    )
}