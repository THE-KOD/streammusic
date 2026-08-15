import { SectionHeader } from '../../../home/presentation/components/section-header'
import { AlbumCardWithSave } from './album-card-with-save'
import { EmptyState } from '../../../../shared/components/states'
import type { Album } from '../../../../shared/types/album'

interface AlbumsSectionProps {
    albums: Album[]
    onAlbumClick?: (albumId: string) => void
}

export function AlbumsSection({ albums, onAlbumClick }: AlbumsSectionProps) {
    if (albums.length === 0) {
        return <section className="mb-8"><SectionHeader title="Albums" /><EmptyState message="Aucun album disponible." /></section>
    }
    return (
        <section className="mb-8">
            <SectionHeader title="Albums" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {albums.map((album) => (
                    <AlbumCardWithSave key={album.id} album={album} showArtist={false} onClick={() => onAlbumClick?.(album.id)} />
                ))}
            </div>
        </section>
    )
}