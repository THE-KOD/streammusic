import { AlbumCard } from '../../../../shared/components/album-card'
import { useAlbumSave } from '../../../favorites'
import type { Album } from '../../../../shared/types/album'

interface AlbumCardWithSaveProps {
    album: Album
    showArtist?: boolean
    onClick: () => void
}

export function AlbumCardWithSave({ album, showArtist, onClick }: AlbumCardWithSaveProps) {
    const { isSaved, toggle } = useAlbumSave(album.id)
    return <AlbumCard {...album} showArtist={showArtist} isSaved={isSaved} onToggleSave={toggle} onClick={onClick} />
}