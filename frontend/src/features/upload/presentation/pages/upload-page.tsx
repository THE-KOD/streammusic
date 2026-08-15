import { useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '../../../../shared/components/page-header'
import { Card } from '../../../../shared/components/card'
import { Button } from '../../../../shared/components/button'
import { Input } from '../../../../shared/components/input'
import { SelectField } from '../components/select-field'
import { AudioFileUpload } from '../components/audio-file-upload'
import { CoverImageUpload } from '../components/cover-image-upload'
import { ErrorState } from '../../../../shared/components/states'
import { useArtists, useAlbums, useGenres } from '../hooks/use-upload-catalog'
import { useSubmitTrack } from '../hooks/use-submit-track'
import { useToastStore } from '../../../../core/store/toast-store'

export function UploadPage() {
  const navigate = useNavigate()
  const showToast = useToastStore((state) => state.showToast)

  const [title, setTitle] = useState('')
  const [artistId, setArtistId] = useState('')
  const [albumId, setAlbumId] = useState('')
  const [genreId, setGenreId] = useState('')
  const [releaseDate, setReleaseDate] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioDuration, setAudioDuration] = useState<number | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { artists, isLoading: artistsLoading, error: artistsError } = useArtists()
  const { albums, isLoading: albumsLoading } = useAlbums(artistId || undefined)
  const { genres, isLoading: genresLoading, error: genresError } = useGenres()
  const { isSubmitting, error: submitError, submit } = useSubmitTrack()

  const artistOptions = artists.map((a) => ({ id: a.id, name: a.name }))
  const albumOptions = albums.map((a) => ({ id: a.id, name: a.title }))
  const genreOptions = genres.map((g) => ({ id: g.id, name: g.name }))

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!title.trim()) newErrors.title = 'Le titre est obligatoire.'
    if (!artistId) newErrors.artist = "L'artiste est obligatoire."
    if (!genreId) newErrors.genre = 'Le genre est obligatoire.'
    if (!audioFile) newErrors.audio = 'Le fichier audio est obligatoire.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    if (!audioFile || audioDuration === null) return

    try {
      await submit({ title, artistId, albumId: albumId || undefined, genreId, releaseDate: releaseDate || undefined, duration: audioDuration, audioFile, coverFile })
      showToast('Titre soumis avec succès.', 'success')
      navigate('/home')
    } catch {
      // erreur déjà affichée via submitError
    }
  }

  const isFormValid = title.trim() && artistId && genreId && audioFile

  if (artistsError || genresError) {
    return <ErrorState message="Erreur de chargement des données." onRetry={() => window.location.reload()} />
  }

  return (
      <div>
        <PageHeader title="Upload de titre" />
        <div className="mb-6">
          <h2 className="font-display text-2xl font-semibold text-ivory">Ajouter un nouveau titre</h2>
          <p className="text-muted font-body">Renseignez les informations de votre morceau avant de le soumettre à StreamMusic.</p>
        </div>

        <Card className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted font-body mb-4">Informations du titre</h3>
          <div className="space-y-4">
            <Input label="Titre du morceau" required value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} placeholder="Entrez le titre" disabled={isSubmitting} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField label="Artiste" required options={artistOptions} value={artistId} onChange={setArtistId} placeholder="Sélectionner un artiste" error={errors.artist} disabled={isSubmitting || artistsLoading} isLoading={artistsLoading} />
              <SelectField label="Album" options={albumOptions} value={albumId} onChange={setAlbumId} placeholder="Sélectionner un album" disabled={isSubmitting || !artistId || albumsLoading} isLoading={albumsLoading} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField label="Genre" required options={genreOptions} value={genreId} onChange={setGenreId} placeholder="Sélectionner un genre" error={errors.genre} disabled={isSubmitting || genresLoading} isLoading={genresLoading} />
              <Input label="Date de sortie" type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} disabled={isSubmitting} />
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted font-body mb-4">Fichier audio</h3>
          <AudioFileUpload
              onFileSelect={(file, duration) => { setAudioFile(file); setAudioDuration(duration); setErrors((prev) => ({ ...prev, audio: '' })) }}
              onRemove={() => { setAudioFile(null); setAudioDuration(null) }}
              error={errors.audio} disabled={isSubmitting}
          />
        </Card>

        <Card className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted font-body mb-4">Pochette</h3>
          <CoverImageUpload onImageSelect={setCoverFile} onRemove={() => setCoverFile(null)} disabled={isSubmitting} />
          {coverFile && <p className="text-xs text-muted mt-2">Aperçu de la pochette après sélection</p>}
        </Card>

        <Card className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted font-body mb-4">Soumission</h3>
          <p className="text-muted font-body mb-4">Le titre sera soumis pour validation après son envoi.</p>
          {submitError && (
              <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-lg text-sm text-danger flex items-center justify-between gap-3">
                <span>{submitError}</span>
                <Button variant="secondary" size="sm" onClick={handleSubmit}>Réessayer</Button>
              </div>
          )}
          <Button variant="primary" size="lg" className="w-full md:w-auto" onClick={handleSubmit} disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? 'Soumission...' : 'Soumettre le titre'}
          </Button>
        </Card>
      </div>
  )
}