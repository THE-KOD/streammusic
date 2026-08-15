import { useState } from 'react'
import { PlaylistTrackRow } from './playlist-track-row'
import type { PlaylistTrack } from '../../domain/playlist.entity'

interface ReorderablePlaylistTrackListProps {
    tracks: PlaylistTrack[]
    onPlay: (trackId: string) => void
    onAddToQueue?: (trackId: string) => void
    onRemove: (playlistTrackId: string) => void
    onReorder: (from: number, to: number) => void
}

export function ReorderablePlaylistTrackList({ tracks, onPlay, onAddToQueue, onRemove, onReorder }: ReorderablePlaylistTrackListProps) {
    const [dragIndex, setDragIndex] = useState<number | null>(null)
    const handleDragStart = (index: number) => setDragIndex(index)
    const handleDragOver = (index: number) => {
        if (dragIndex === null || dragIndex === index) return
        onReorder(dragIndex, index)
        setDragIndex(index)
    }
    const handleDragEnd = () => setDragIndex(null)

    return (
        <div className="space-y-1">
            <div className="grid grid-cols-[2rem_2.5rem_1fr_auto] gap-3 px-3 py-1 text-xs uppercase tracking-wide text-muted font-body">
                <span /><span>#</span><span>Titre</span><span>Durée</span>
            </div>
            {tracks.map((track, index) => (
                <div key={track.id} draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => { e.preventDefault(); handleDragOver(index) }} onDragEnd={handleDragEnd} className={`cursor-grab ${dragIndex === index ? 'opacity-50' : ''}`}>
                    <PlaylistTrackRow track={track} isDraggable onPlay={() => onPlay(track.track.id)} onAddToQueue={onAddToQueue ? () => onAddToQueue(track.track.id) : undefined} onRemove={() => onRemove(track.id)} />
                </div>
            ))}
        </div>
    )
}