import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Card } from '../../../../shared/components/card'
import { Button } from '../../../../shared/components/button'
import { Input } from '../../../../shared/components/input'
import { SelectField } from '../components/select-field'
import { AudioFileUpload } from '../components/audio-file-upload'
import { CoverImageUpload } from '../components/cover-image-upload'
import { LoadingState } from '../../../../shared/components/states'
import { useAlbums, useGenres } from '../hooks/use-upload-catalog'
import { useSubmitTrack } from '../hooks/use-submit-track'
import { useMyArtist } from '../hooks/use-my-artist'
import { uploadCatalogService } from '../../data/upload-catalog.service'
import { useToastStore } from '../../../../core/store/toast-store'
import { Upload, CheckCircle2, Mic } from 'lucide-react'

export function UploadPage() {
  const navigate = useNavigate()
  const showToast = useToastStore((state) => state.showToast)
  const myArtist = useMyArtist()

  const [title, setTitle] = useState('')
  const [albumId, setAlbumId] = useState('')
  const [genreId, setGenreId] = useState('')
  const [releaseDate, setReleaseDate] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioDuration, setAudioDuration] = useState<number | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isBecomingArtist, setIsBecomingArtist] = useState(false)

  const { albums, isLoading: albumsLoading } = useAlbums(myArtist.artist?.id)
  const { genres, isLoading: genresLoading } = useGenres()
  const { isSubmitting, error: submitError, submit } = useSubmitTrack()

  const albumOptions = albums.map((a) => ({ id: a.id, name: a.title }))
  const genreOptions = genres.map((g) => ({ id: g.id, name: g.name }))

  const steps = [
    { label: 'Infos du titre', completed: !!title && !!genreId },
    { label: 'Fichier audio', completed: !!audioFile },
    { label: 'Pochette', completed: true },
  ]
  const progress = (steps.filter((s) => s.completed).length / steps.length) * 100

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!title.trim()) newErrors.title = 'Le titre est obligatoire.'
    if (!genreId) newErrors.genre = 'Le genre est obligatoire.'
    if (!audioFile) newErrors.audio = 'Le fichier audio est obligatoire.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    if (!audioFile || audioDuration === null) return

    try {
      await submit({ title, albumId: albumId || undefined, genreId, releaseDate: releaseDate || undefined, duration: audioDuration, audioFile, coverFile })
      showToast('Titre soumis avec succès', 'success')
      navigate('/home')
    } catch {
      // erreur déjà affichée via submitError
    }
  }

  const handleBecomeArtist = async () => {
    setIsBecomingArtist(true)
    try {
      await uploadCatalogService.becomeArtist()
      showToast('Profil artiste créé', 'success')
      myArtist.reload()
    } catch {
      showToast('Impossible de créer le profil artiste.', 'error')
    } finally {
      setIsBecomingArtist(false)
    }
  }

  const isFormValid = title.trim() && genreId && audioFile

  if (myArtist.isLoading) return <LoadingState />

  // Garde-fou : uploader nécessite un profil artiste — voir la note en tête
  // de réponse sur pourquoi le formulaire ne peut plus proposer de choisir
  // un artiste arbitraire (le backend attribue toujours au compte connecté).
  if (!myArtist.artist) {
    return (
        <div className="max-w-lg mx-auto text-center py-16 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center mx-auto">
            <Mic className="w-8 h-8 text-amber" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ivory">Devenez artiste pour uploader</h1>
          <p className="text-sm text-muted">Votre compte n'a pas encore de profil artiste — créez-en un pour publier vos titres.</p>
          <Button variant="primary" size="lg" onClick={handleBecomeArtist} disabled={isBecomingArtist}>
            {isBecomingArtist ? 'Création...' : 'Devenir artiste'}
          </Button>
        </div>
    )
  }

  return (
      <div className="space-y-8">
        <div className="relative p-6 rounded-xl bg-gradient-to-br from-surface to-surface-raised border border-white/5 overflow-hidden">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-amber/10 rounded-full blur-2xl" />
          <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-teal/10 rounded-full blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber/20 flex items-center justify-center text-amber shrink-0">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-ivory">Upload de titre</h1>
              <p className="text-sm text-muted mt-0.5">Publié sous le nom : {myArtist.artist.pseudo}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-surface-raised rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber to-teal rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-muted/60">
            {steps.map((step, i) => (
                <span key={i} className="flex items-center gap-1">
              {step.completed ? <CheckCircle2 className="w-3 h-3 text-teal" /> : <span className="w-3 h-3 rounded-full border border-white/10" />}
                  {step.label}
            </span>
            ))}
          </div>
        </div>

        <Card className="p-5 border border-white/5 hover:border-white/10 transition-all duration-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-4 bg-amber rounded-full" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-body">Informations du titre</h3>
            <span className="text-[10px] text-danger font-medium ml-auto">* Champs obligatoires</span>
          </div>

          <div className="space-y-4">
            <Input label="Titre du morceau" required value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} placeholder="Entrez le titre de votre morceau" disabled={isSubmitting} className="text-base" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField label="Album" options={albumOptions} value={albumId} onChange={setAlbumId} placeholder="Sélectionner un album (optionnel)" disabled={isSubmitting || albumsLoading} isLoading={albumsLoading} />
              <SelectField label="Genre" required options={genreOptions} value={genreId} onChange={setGenreId} placeholder="Sélectionner un genre" error={errors.genre} disabled={isSubmitting || genresLoading} isLoading={genresLoading} />
            </div>

            <Input label="Date de sortie" type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} disabled={isSubmitting} />
          </div>
        </Card>

        <Card className="p-5 border border-white/5 hover:border-white/10 transition-all duration-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-4 bg-amber rounded-full" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-body">Fichier audio</h3>
            <span className="text-[10px] text-danger font-medium ml-auto">* Obligatoire</span>
          </div>
          <AudioFileUpload
              onFileSelect={(file, duration) => { setAudioFile(file); setAudioDuration(duration); setErrors((prev) => ({ ...prev, audio: '' })) }}
              onRemove={() => { setAudioFile(null); setAudioDuration(null) }}
              error={errors.audio}
              disabled={isSubmitting}
          />
        </Card>

        <Card className="p-5 border border-white/5 hover:border-white/10 transition-all duration-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-4 bg-teal rounded-full" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-body">Pochette</h3>
            <span className="text-[10px] text-muted/60 ml-auto">Optionnel</span>
          </div>
          <CoverImageUpload onImageSelect={setCoverFile} onRemove={() => setCoverFile(null)} disabled={isSubmitting} />
        </Card>

        <Card className="p-5 border border-white/5 bg-surface/40 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-body">Soumission</h3>
              <p className="text-sm text-muted mt-0.5">{isFormValid ? 'Tous les champs obligatoires sont remplis' : 'Remplissez tous les champs obligatoires pour soumettre'}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {submitError && <div className="text-sm text-danger flex items-center gap-2"><span>{submitError}</span></div>}
              <Button variant="primary" size="lg" onClick={handleSubmit} disabled={!isFormValid || isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? 'Soumission...' : (<><Upload className="w-4 h-4" />Soumettre le titre</>)}
              </Button>
            </div>
          </div>
        </Card>
      </div>
  )
}