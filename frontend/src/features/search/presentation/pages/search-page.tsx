// features/search/presentation/pages/search-page.tsx
import { useNavigate } from 'react-router'
import { SearchBar } from '../components/search-bar'
import { FilterPanel } from '../components/filter-panel'
import { TrackRow } from '../../../../shared/components/track-row'
import { ArtistItem } from '../components/artist-item'
import { AlbumCardWithSave } from '../components/album-card-with-save'
import { LoadingState, EmptyState, ErrorState } from '../../../../shared/components/states'
import { SectionHeader } from '../../../home/presentation/components/section-header'
import { useSearch } from '../hooks/use-search'
import { usePlayerStore } from '../../../player/presentation/store/player-store'

export function SearchPage() {
    const navigate = useNavigate()
    const { query, setQuery, filters, setFilters, results, isSearching, error, search, reset } =
        useSearch()
    const playTrack = usePlayerStore((state) => state.playTrack)

    return (
        <div className="space-y-6">
            <SearchBar value={query} onChange={setQuery} onSearch={search} isLoading={isSearching} />
            <FilterPanel filters={filters} onFiltersChange={setFilters} onReset={reset} />

            {!isSearching && !results && !error && (
                <EmptyState
                    title="Recherchez votre musique"
                    message="Tapez un nom d'artiste, un titre ou un album dans la barre de recherche."
                />
            )}

            {isSearching && <LoadingState />}
            {error && <ErrorState message={error} onRetry={search} />}

            {results && !isSearching && !error && (
                <div className="space-y-8 animate-fade-in">
                    {results.artists.length > 0 && (
                        <section>
                            <SectionHeader title="Artistes" />
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {results.artists.map((artist) => (
                                    <ArtistItem
                                        key={artist.id}
                                        name={artist.name}
                                        imageUrl={artist.imageUrl}
                                        onClick={() => navigate(`/artists/${artist.id}`)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {results.albums.length > 0 && (
                        <section>
                            <SectionHeader title="Albums" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {results.albums.map((album) => (
                                    <AlbumCardWithSave
                                        key={album.id}
                                        album={album}
                                        onClick={() => navigate(`/albums/${album.id}`)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {results.tracks.length > 0 && (
                        <section>
                            <SectionHeader title="Titres" />
                            <div className="bg-surface/40 backdrop-blur-sm rounded-xl p-2 border border-white/5">
                                {results.tracks.map((track) => (
                                    <TrackRow
                                        key={track.id}
                                        {...track}
                                        onPlay={() => playTrack(track, results.tracks)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {results.artists.length === 0 &&
                        results.albums.length === 0 &&
                        results.tracks.length === 0 && (
                            <EmptyState
                                title={`Aucun résultat pour “${query}”`}
                                message="Essayez d'autres mots-clés ou réinitialisez les filtres."
                                action={
                                    <button
                                        onClick={reset}
                                        className="text-teal hover:underline text-sm font-medium"
                                    >
                                        Réinitialiser les filtres
                                    </button>
                                }
                            />
                        )}
                </div>
            )}
        </div>
    )
}