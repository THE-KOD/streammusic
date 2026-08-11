import { useState } from 'react'  // <-- plus de useEffect
import { AppHeader } from '../../../../shared/components/AppHeader'
import { AudioPlayer } from '../../../../shared/components/AudioPlayer'
import { SearchBar } from '../components/SearchBar'
import { FilterPanel } from '../components/FilterPanel'
import { SearchTrackRow } from '../components/SearchTrackRow'
import { ArtistItem } from '../components/ArtistItem'
import { AlbumCard } from '../components/AlbumCard'
import { LoadingState, EmptyState, ErrorState } from '../../../../shared/components/states'
import { SectionHeader } from '../../../home/presentation/components/SectionHeader'

// Données mockées
const mockArtists = [{ id: 'a1', name: 'Artiste 1' }, { id: 'a2', name: 'Artiste 2' }]
const mockAlbums = [{ id: 'al1', title: 'Album 1', artist: 'Artiste 1', releaseDate: '2025-01-01' }]
const mockTracks = [
  { id: 't1', title: 'Titre 1', artist: 'Artiste 1', album: 'Album 1', duration: 180 },
  { id: 't2', title: 'Titre 2', artist: 'Artiste 2', album: 'Album 2', duration: 240 },
]

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<{ artists: any[]; albums: any[]; tracks: any[] } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = () => {
    if (!query.trim()) {
      setResults(null)
      return
    }
    setSearching(true)
    setError(null)
    setTimeout(() => {
      if (query.toLowerCase().includes('drake')) {
        setResults({ artists: mockArtists, albums: mockAlbums, tracks: mockTracks })
      } else if (query.toLowerCase().includes('rien')) {
        setResults({ artists: [], albums: [], tracks: [] })
      } else {
        setResults({ artists: mockArtists.slice(0, 1), albums: mockAlbums, tracks: mockTracks })
      }
      setSearching(false)
    }, 1000)
  }

  const handleReset = () => {
    setQuery('')
    setResults(null)
    setError(null)
  }

  return (
      <div className="min-h-screen bg-ink pb-24">
        <AppHeader />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <SearchBar value={query} onChange={setQuery} onSearch={handleSearch} isLoading={searching} />
          <FilterPanel onReset={handleReset} />

          {!searching && !results && !error && (
              <EmptyState message="Recherchez un titre, un artiste ou un album. Utilisez la barre de recherche pour commencer." />
          )}

          {searching && <LoadingState />}

          {error && <ErrorState message={error} onRetry={handleSearch} />}

          {results && !searching && !error && (
              <div className="space-y-6">
                {results.artists.length > 0 && (
                    <section>
                      <SectionHeader title="Artistes" />
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {results.artists.map((artist) => (
                            <ArtistItem key={artist.id} name={artist.name} />
                        ))}
                      </div>
                    </section>
                )}

                {results.albums.length > 0 && (
                    <section>
                      <SectionHeader title="Albums" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.albums.map((album) => (
                            <AlbumCard key={album.id} {...album} />
                        ))}
                      </div>
                    </section>
                )}

                {results.tracks.length > 0 && (
                    <section>
                      <SectionHeader title="Titres" />
                      <div className="space-y-1">
                        {results.tracks.map((track) => (
                            <SearchTrackRow key={track.id} {...track} />
                        ))}
                      </div>
                    </section>
                )}

                {results.artists.length === 0 && results.albums.length === 0 && results.tracks.length === 0 && (
                    <EmptyState
                        message={`Aucun résultat pour « ${query} ». Essayez avec un autre titre, artiste ou album.`}
                        action={<button onClick={handleReset} className="text-teal hover:underline text-sm">Réinitialiser les filtres</button>}
                    />
                )}
              </div>
          )}
        </main>
        <AudioPlayer />
      </div>
  )
}