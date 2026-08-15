import { AlbumCard } from '../../../../shared/components/album-card'
import type { Album } from '../../../../shared/types/album'

interface SavedAlbumCardProps {
    album: Album
    onClick: () => void
    onUnsave: () => void
}

export function SavedAlbumCard({ album, onClick, onUnsave }: SavedAlbumCardProps) {
    return <AlbumCard {...album} isSaved onToggleSave={onUnsave} onClick={onClick} />
}