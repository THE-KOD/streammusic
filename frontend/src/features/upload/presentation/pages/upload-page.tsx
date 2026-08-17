// features/upload/presentation/pages/upload-page.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router'
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
import { Upload, CheckCircle2 } from 'lucide-react'

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

  // Calcul de la progression
  const steps = [
    { label: 'Infos du titre', completed: !!title && !!artistId && !!genreId },
    { label: 'Fichier audio', completed: !!audioFile },
    { label: 'Pochette', completed: true },
  ]
  const progress = steps.filter(s => s.completed).length / steps.length * 100

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
      await submit({
        title,
        artistId,
        albumId: albumId || undefined,
        genreId,
        releaseDate: releaseDate || undefined,
        duration: audioDuration,
        audioFile,
        coverFile,
      })
      showToast('Titre soumis avec succès ! ', 'success')
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
      <div className="space-y-8">
        {/* En-tête immersif */}
        <div className="relative p-6 rounded-xl bg-gradient-to-br from-surface to-surface-raised border border-white/5 overflow-hidden">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-amber/10 rounded-full blur-2xl" />
          <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-teal/10 rounded-full blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber/20 flex items-center justify-center text-amber shrink-0">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-ivory">Upload de titre</h1>
              <p className="text-sm text-muted mt-0.5">Ajoutez un nouveau morceau au catalogue</p>
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-surface-raised rounded-full overflow-hidden">
            <div
                className="h-full bg-gradient-to-r from-amber to-teal rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted/60">
            {steps.map((step, i) => (
                <span key={i} className="flex items-center gap-1">
              {step.completed ? (
                  <CheckCircle2 className="w-3 h-3 text-teal" />
              ) : (
                  <span className="w-3 h-3 rounded-full border border-white/10" />
              )}
                  {step.label}
            </span>
            ))}
          </div>
        </div>

        {/* Informations du titre */}
        <Card className="p-5 border border-white/5 hover:border-white/10 transition-all duration-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-4 bg-amber rounded-full" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-body">Informations du titre</h3>
            <span className="text-[10px] text-danger font-medium ml-auto">* Champs obligatoires</span>
          </div>

          <div className="space-y-4">
            <Input
                label="Titre du morceau"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
                placeholder="Entrez le titre de votre morceau"
                disabled={isSubmitting}
                className="text-base"
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
        <Card className="p-5 border border-white/5 hover:border-white/10 transition-all duration-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-4 bg-amber rounded-full" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-body">Fichier audio</h3>
            <span className="text-[10px] text-danger font-medium ml-auto">* Obligatoire</span>
          </div>
          <AudioFileUpload
              onFileSelect={(file, duration) => {
                setAudioFile(file)
                setAudioDuration(duration)
                setErrors((prev) => ({ ...prev, audio: '' }))
              }}
              onRemove={() => { setAudioFile(null); setAudioDuration(null) }}
              error={errors.audio}
              disabled={isSubmitting}
          />
        </Card>

        {/* Pochette */}
        <Card className="p-5 border border-white/5 hover:border-white/10 transition-all duration-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-4 bg-teal rounded-full" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-body">Pochette</h3>
            <span className="text-[10px] text-muted/60 ml-auto">Optionnel</span>
          </div>
          <CoverImageUpload
              onImageSelect={setCoverFile}
              onRemove={() => setCoverFile(null)}
              disabled={isSubmitting}
          />
        </Card>

        {/* Soumission */}
        <Card className="p-5 border border-white/5 bg-surface/40 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-body">Soumission</h3>
              <p className="text-sm text-muted mt-0.5">
                {isFormValid
                    ? 'Tous les champs obligatoires sont remplis ✅'
                    : 'Remplissez tous les champs obligatoires pour soumettre'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {submitError && (
                  <div className="text-sm text-danger flex items-center gap-2">
                    <span>{submitError}</span>
                  </div>
              )}
              <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!isFormValid || isSubmitting}
                  className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                    <>
                      <span className="animate-pulse">●</span>
                      Soumission...
                    </>
                ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Soumettre le titre
                    </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
  )
}