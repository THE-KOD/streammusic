import { useState, useEffect } from 'react'
import { AppHeader } from '../../../../shared/components/AppHeader'
import { AudioPlayer } from '../../../../shared/components/AudioPlayer'
import { Greeting } from '../components/Greeting'
import { SectionHeader } from '../components/SectionHeader'
import { TrackCard } from '../components/TrackCard'
import { LoadingState, EmptyState, ErrorState } from '../../../../shared/components/states'

// Données mockées
const mockTracks = [
  { id: '1', title: 'Titre 1', artist: 'Artiste 1', album: 'Album 1', duration: 180, coverUrl: '', playCount: 1200 },
  { id: '2', title: 'Titre 2', artist: 'Artiste 2', album: 'Album 2', duration: 240, coverUrl: '', playCount: 800 },
  { id: '3', title: 'Titre 3', artist: 'Artiste 3', album: 'Album 3', duration: 200, coverUrl: '', playCount: 500 },
]

export function HomePage() {
  const [popular, setPopular] = useState<any[]>([])
  const [newReleases, setNewReleases] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState({ popular: true, newReleases: true, recommendations: true })

  useEffect(() => {
    setTimeout(() => {
      setPopular(mockTracks)
      setLoading(prev => ({ ...prev, popular: false }))
    }, 1000)
    setTimeout(() => {
      setNewReleases(mockTracks.slice(1))
      setLoading(prev => ({ ...prev, newReleases: false }))
    }, 1500)
    setTimeout(() => {
      setRecommendations([])
      setLoading(prev => ({ ...prev, recommendations: false }))
    }, 800)
  }, [])

  // Suppression du paramètre seeMoreLink (inutilisé)
  const renderSection = (
      title: string,
      subtitle: string | undefined,
      data: any[],
      loadingState: boolean,
      errorMsg: string | undefined,
  ) => {
    if (loadingState) return <LoadingState />
    if (errorMsg) return <ErrorState message={errorMsg} onRetry={() => {}} />
    if (data.length === 0) {
      return (
          <EmptyState
              title={title}
              message={subtitle || 'Aucun contenu disponible.'}
          />
      )
    }
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data.map((track) => (
              <TrackCard key={track.id} {...track} />
          ))}
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-ink pb-24">
        <AppHeader />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Greeting pseudo="Utilisateur" />

          {/* Populaires */}
          <section className="mb-8">
            <SectionHeader title="Titres populaires" seeMoreLink="/popular" />
            {renderSection('Populaires', undefined, popular, loading.popular, undefined)}
          </section>

          {/* Nouveautés */}
          <section className="mb-8">
            <SectionHeader title="Nouveautés" seeMoreLink="/new-releases" />
            {renderSection('Nouveautés', undefined, newReleases, loading.newReleases, undefined)}
          </section>

          {/* Pour vous */}
          <section className="mb-8">
            <SectionHeader title="Pour vous" subtitle="Basé sur votre activité d'écoute" />
            {renderSection(
                'Pour vous',
                "Nous n'avons pas encore assez d'écoute pour personnaliser vos recommandations.",
                recommendations,
                loading.recommendations,
                undefined
            )}
          </section>
        </main>
        <AudioPlayer />
      </div>
  )
}