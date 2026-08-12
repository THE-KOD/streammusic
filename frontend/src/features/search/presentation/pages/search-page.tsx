import { SearchBar } from '../components/search-bar'
import { FilterPanel } from '../components/filter-panel'
import { TrackRow } from '../../../../shared/components/track-row'
import { ArtistItem } from '../components/artist-item'
import { AlbumCard } from '../../../../shared/components/album-card'
import { LoadingState, EmptyState, ErrorState } from '../../../../shared/components/states'
import { SectionHeader } from '../../../home/presentation/components/section-header'
import { useSearch } from '../hooks/use-search'

export function SearchPage() {
  const { query, setQuery, filters, setFilters, results, isSearching, error, search, reset } = useSearch()

  return (
      <>
        <SearchBar value={query} onChange={setQuery} onSearch={search} isLoading={isSearching} />
        <FilterPanel filters={filters} onFiltersChange={setFilters} onReset={reset} />

        {!isSearching && !results && !error && <EmptyState message="Recherchez un titre, un artiste ou un album pour commencer." />}
        {isSearching && <LoadingState />}
        {error && <ErrorState message={error} onRetry={search} />}

        {results && !isSearching && !error && (
            <div className="space-y-6">
              {results.artists.length > 0 && (
                  <section>
                    <SectionHeader title="Artistes" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {results.artists.map((artist) => <ArtistItem key={artist.id} name={artist.name} imageUrl={artist.imageUrl} />)}
                    </div>
                  </section>
              )}
              {results.albums.length > 0 && (
                  <section>
                    <SectionHeader title="Albums" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.albums.map((album) => <AlbumCard key={album.id} {...album} />)}
                    </div>
                  </section>
              )}
              {results.tracks.length > 0 && (
                  <section>
                    <SectionHeader title="Titres" />
                    <div className="space-y-1">
                      {results.tracks.map((track) => <TrackRow key={track.id} {...track} />)}
                    </div>
                  </section>
              )}
              {results.artists.length === 0 && results.albums.length === 0 && results.tracks.length === 0 && (
                  <EmptyState
                      message={`Aucun résultat pour « ${query} ».`}
                      action={<button onClick={reset} className="text-teal hover:underline text-sm">Réinitialiser les filtres</button>}
                  />
              )}
            </div>
        )}
      </>
  )
}