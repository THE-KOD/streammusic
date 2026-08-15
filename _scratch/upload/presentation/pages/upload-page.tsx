// features/upload/presentation/pages/upload-page.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '../../../../shared/components/page-header'
import { Card } from '../../../../shared/components/card'
import { Button } from '../../../../shared/components/button'
import { Input } from '../../../../shared/components/input'
import { SelectField } from '../components/select-field'
import { AudioFileUpload } from '../components/audio-file-upload'
import { CoverImageUpload } from '../components/cover-image-upload'
import { ErrorState } from '../../../../shared/components/states' // LoadingState retiré
import { useArtists, useAlbums, useGenres, useSubmitTrack } from '../hooks/use-upload'
import { useToastStore } from '../../../../core/store/toast-store'

export function UploadPage() {
  const navigate = useNavigate()
  const showToast = useToastStore((state) => state.showToast)

  // Métadonnées
  const [title, setTitle] = useState('')
  const [artistId, setArtistId] = useState('')
  const [albumId, setAlbumId] = useState('')
  const [genreId, setGenreId] = useState('')
  const [releaseDate, setReleaseDate] = useState('')

  // Fichiers
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioDuration, setAudioDuration] = useState<number | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)

  // Erreurs de validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Données
  const { artists, isLoading: artistsLoading, error: artistsError } = useArtists()
  const { albums, isLoading: albumsLoading } = useAlbums(artistId || undefined)
  const { genres, isLoading: genresLoading, error: genresError } = useGenres()
  const { isSubmitting, error: submitError, submit } = useSubmitTrack()

  // Map pour SelectField
  const artistOptions = artists.map(a => ({ id: a.id, name: a.name }))
  const albumOptions = albums.map(a => ({ id: a.id, name: a.title }))
  const genreOptions = genres.map(g => ({ id: g.id, name: g.name }))

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!title.trim()) newErrors.title = 'Le titre est obligatoire.'
    if (!artistId) newErrors.artist = 'L\'artiste est obligatoire.'
    if (!genreId) newErrors.genre = 'Le genre est obligatoire.'
    if (!audioFile) newErrors.audio = 'Le fichier audio est obligatoire.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const trackData = {
      title,
      artistId,
      albumId: albumId || undefined,
      genreId,
      releaseDate: releaseDate || undefined,
      audioFile,
      coverFile,
      duration: audioDuration,
    }

    try {
      await submit(trackData)
      showToast('Titre soumis avec succès.', 'success')
      navigate('/home')
    } catch {
      // handled by hook
    }
  }

  const isFormValid = title.trim() && artistId && genreId && audioFile

  if (artistsError || genresError) {
    return <ErrorState message="Erreur de chargement des données." onRetry={() => window.location.reload()} />
  }

  return (
      <div>
        <PageHeader title="Upload de titre" />

        {/* Introduction */}
        <div className="mb-6">
          <h2 className="font-display text-2xl font-semibold text-ivory">Ajouter un nouveau titre</h2>
          <p className="text-muted font-body">
            Renseignez les informations de votre morceau avant de le soumettre à StreamMusic.
          </p>
        </div>

        {/* Informations du titre */}
        <Card className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted font-body mb-4">
            INFORMATIONS DU TITRE
          </h3>
          <div className="space-y-4">
            <Input
                label="Titre du morceau"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
                placeholder="Entrez le titre"
                disabled={isSubmitting}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                  label="Artiste"
                  required
                  options={artistOptions}
                  value={artistId}
                  onChange={setArtistId}
                  placeholder="Sélectionner un artiste"
                  error={errors.artist}
                  disabled={isSubmitting || artistsLoading}
                  isLoading={artistsLoading}
              />
              <SelectField
                  label="Album"
                  options={albumOptions}
                  value={albumId}
                  onChange={setAlbumId}
                  placeholder="Sélectionner un album"
                  disabled={isSubmitting || !artistId || albumsLoading}
                  isLoading={albumsLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                  label="Genre"
                  required
                  options={genreOptions}
                  value={genreId}
                  onChange={setGenreId}
                  placeholder="Sélectionner un genre"
                  error={errors.genre}
                  disabled={isSubmitting || genresLoading}
                  isLoading={genresLoading}
              />
              <Input
                  label="Date de sortie"
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  disabled={isSubmitting}
              />
            </div>
          </div>
        </Card>

        {/* Fichier audio */}
        <Card className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted font-body mb-4">
            FICHIER AUDIO
          </h3>
          <div className="space-y-2">
            <AudioFileUpload
                onFileSelect={(file, duration) => {
                  setAudioFile(file)
                  setAudioDuration(duration)
                  setErrors(prev => ({ ...prev, audio: '' }))
                }}
                onRemove={() => {
                  setAudioFile(null)
                  setAudioDuration(null)
                }}
                error={errors.audio}
                disabled={isSubmitting}
            />
          </div>
        </Card>

        {/* Pochette */}
        <Card className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted font-body mb-4">
            POCHETTE
          </h3>
          <CoverImageUpload
              onImageSelect={setCoverFile}
              onRemove={() => setCoverFile(null)}
              disabled={isSubmitting}
          />
          {coverFile && (
              <p className="text-xs text-muted mt-2">Aperçu de la pochette après sélection</p>
          )}
        </Card>

        {/* Soumission */}
        <Card className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted font-body mb-4">
            SOUMISSION
          </h3>
          <p className="text-muted font-body mb-4">
            Le titre sera soumis pour validation après son envoi.
          </p>
          {submitError && (
              <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-lg text-sm text-danger">
                {submitError}
                <Button variant="secondary" size="sm" className="ml-3" onClick={handleSubmit}>
                  Réessayer
                </Button>
              </div>
          )}
          <Button
              variant="primary"
              size="lg"
              className="w-full md:w-auto"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Soumission...' : 'SOUMETTRE LE TITRE'}
          </Button>
        </Card>
      </div>
  )
}