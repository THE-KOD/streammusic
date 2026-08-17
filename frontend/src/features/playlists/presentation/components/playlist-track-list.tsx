// features/playlists/presentation/components/playlist-track-list.tsx
import { PlaylistTrackRow } from './playlist-track-row'
import { ReorderablePlaylistTrackList } from './reorderable-playlist-track-list'
import type { PlaylistTrack } from '../../domain/playlist.entity'

interface PlaylistTrackListProps {
    tracks: PlaylistTrack[]
    isReorderable?: boolean
    onPlay: (trackId: string) => void
    onAddToQueue?: (trackId: string) => void
    onRemove: (playlistTrackId: string) => void
    onReorder?: (from: number, to: number) => void
}

export function PlaylistTrackList({
                                      tracks,
                                      isReorderable = false,
                                      onPlay,
                                      onAddToQueue,
                                      onRemove,
                                      onReorder,
                                  }: PlaylistTrackListProps) {
    if (tracks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-surface-raised flex items-center justify-center text-muted">
                    <span className="text-3xl">♫</span>
                </div>
                <p className="text-muted font-body">Cette playlist est vide.</p>
                <p className="text-sm text-muted/60">Ajoutez des titres depuis le catalogue.</p>
            </div>
        )
    }

    if (isReorderable && onReorder) {
        return (
            <ReorderablePlaylistTrackList
                tracks={tracks}
                onPlay={onPlay}
                onAddToQueue={onAddToQueue}
                onRemove={onRemove}
                onReorder={onReorder}
            />
        )
    }

    return (
        <div className="space-y-1">
            <div className="grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[2.5rem_1fr_1fr_auto] gap-3 px-3 py-1 text-xs uppercase tracking-wider text-muted/60 font-body border-b border-white/5 pb-2">
                <span>#</span>
                <span>Titre</span>
                <span className="hidden md:block">Artiste</span>
                <span>Durée</span>
            </div>
            {tracks.map((track) => (
                <PlaylistTrackRow
                    key={track.id}
                    track={track}
                    isDraggable={false}
                    onPlay={() => onPlay(track.track.id)}
                    onAddToQueue={onAddToQueue ? () => onAddToQueue(track.track.id) : undefined}
                    onRemove={() => onRemove(track.id)}
                />
            ))}
        </div>
    )
}