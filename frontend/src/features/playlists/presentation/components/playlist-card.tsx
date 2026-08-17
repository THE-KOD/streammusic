// features/playlists/presentation/components/playlist-card.tsx
import { Card } from '../../../../shared/components/card'
import { Button } from '../../../../shared/components/button'
import { DropdownMenu } from '../../../../shared/components/dropdown-menu'
import { MoreHorizontal, Lock, Globe, Music2 } from 'lucide-react'
import type { Playlist } from '../../domain/playlist.entity'

interface PlaylistCardProps {
    playlist: Playlist
    onOpen: () => void
    onRename: () => void
    onVisibilityChange: () => void
    onDelete: () => void
}

export function PlaylistCard({ playlist, onOpen, onRename, onVisibilityChange, onDelete }: PlaylistCardProps) {
    const VisibilityIcon = playlist.isPublic ? Globe : Lock
    const visibilityLabel = playlist.isPublic ? 'Publique' : 'Privée'

    // Génération d'une couleur de fond à partir du nom
    const getColor = (name: string) => {
        const colors = ['#4FB6A8', '#E3A72F', '#E0605A', '#8B92A3', '#EDEAE2']
        let hash = 0
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash)
        }
        return colors[Math.abs(hash) % colors.length]
    }

    const bgColor = getColor(playlist.name)

    return (
        <Card className="group flex flex-col gap-2 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/30 border border-white/5 hover:border-white/10">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    {/* Pochette générée */}
                    <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-display font-semibold shadow-lg"
                        style={{ backgroundColor: bgColor, color: '#14181F' }}
                    >
                        {playlist.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-display text-xl font-semibold text-ivory truncate max-w-[140px]">
                            {playlist.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-muted font-body">
                            <Music2 className="w-3 h-3" />
                            <span>{playlist.trackCount} titre{playlist.trackCount > 1 ? 's' : ''}</span>
                            <span className="w-1 h-1 rounded-full bg-muted/40" />
                            <VisibilityIcon className="w-3 h-3" />
                            <span>{visibilityLabel}</span>
                        </div>
                    </div>
                </div>
                <DropdownMenu
                    ariaLabel="Actions de la playlist"
                    trigger={<MoreHorizontal className="w-5 h-5 text-muted hover:text-ivory transition-colors" />}
                    items={[
                        { label: 'Renommer', onClick: onRename },
                        { label: 'Modifier visibilité', onClick: onVisibilityChange },
                        { label: 'Supprimer', onClick: onDelete, variant: 'danger' },
                    ]}
                />
            </div>
            <div className="flex justify-end mt-1">
                <Button variant="secondary" size="sm" onClick={onOpen} className="w-full sm:w-auto">
                    Ouvrir
                </Button>
            </div>
        </Card>
    )
}