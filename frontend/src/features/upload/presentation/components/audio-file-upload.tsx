import { useState, useRef, type ChangeEvent } from 'react'
import { Upload, X, FileAudio } from 'lucide-react'
import { Spinner } from '../../../../shared/components/spinner'
import { Button } from '../../../../shared/components/button'
import clsx from 'clsx'
import { formatDuration } from '../../../../shared/utils/format-duration'

const MAX_FILE_SIZE_MB = 20
const ACCEPTED_TYPES = ['audio/mpeg', 'audio/ogg', 'audio/wav']

interface AudioFileUploadProps {
    onFileSelect: (file: File, duration: number) => void
    onRemove: () => void
    error?: string
    disabled?: boolean
}

function readAudioDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
        const audio = new Audio()
        const objectUrl = URL.createObjectURL(file)
        audio.addEventListener('loadedmetadata', () => { URL.revokeObjectURL(objectUrl); resolve(audio.duration) })
        audio.addEventListener('error', () => { URL.revokeObjectURL(objectUrl); reject(new Error('invalid')) })
        audio.src = objectUrl
    })
}

export function AudioFileUpload({ onFileSelect, onRemove, error, disabled }: AudioFileUploadProps) {
    const [file, setFile] = useState<File | null>(null)
    const [duration, setDuration] = useState<number | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (!selected) return
        setUploadError(null)

        if (!ACCEPTED_TYPES.includes(selected.type)) { setUploadError('Format non supporté — utilise un fichier MP3, OGG ou WAV.'); return }
        if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) { setUploadError(`Fichier trop volumineux (max ${MAX_FILE_SIZE_MB} Mo).`); return }

        setIsUploading(true)
        try {
            const realDuration = await readAudioDuration(selected)
            setFile(selected)
            setDuration(realDuration)
            onFileSelect(selected, realDuration)
        } catch {
            setUploadError('Impossible de lire ce fichier audio.')
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemove = () => {
        setFile(null); setDuration(null); setUploadError(null)
        if (inputRef.current) inputRef.current.value = ''
        onRemove()
    }

    const displayError = error || uploadError

    return (
        <div className="flex flex-col gap-2">
            <input type="file" accept={ACCEPTED_TYPES.join(',')} onChange={handleFileChange} ref={inputRef} className="hidden" id="audio-upload" disabled={disabled || isUploading} />
            {!file && !isUploading ? (
                <label htmlFor="audio-upload" className={clsx('flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors', displayError ? 'border-danger bg-danger/5' : 'border-white/10 hover:border-teal hover:bg-surface/50', disabled && 'opacity-50 cursor-not-allowed')}>
                    <Upload className="w-8 h-8 text-muted" />
                    <span className="font-body text-sm text-ivory">Sélectionner un fichier</span>
                    <span className="text-xs text-muted">MP3, OGG, WAV — 20 Mo max</span>
                </label>
            ) : isUploading ? (
                <div className="flex flex-col items-center justify-center gap-3 p-6 border border-white/10 rounded-lg bg-surface-raised">
                    <Spinner size="md" />
                    <span className="font-body text-sm text-ivory">Lecture du fichier...</span>
                </div>
            ) : (
                <div className="flex items-center justify-between p-3 border border-teal/30 rounded-lg bg-surface-raised">
                    <div className="flex items-center gap-3 min-w-0">
                        <FileAudio className="w-5 h-5 text-teal flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="font-body text-sm text-ivory truncate">{file?.name}</p>
                            {duration !== null && <p className="text-xs text-muted font-mono">Durée détectée : {formatDuration(duration)}</p>}
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleRemove} aria-label="Retirer le fichier" className="text-muted hover:text-danger"><X className="w-4 h-4" /></Button>
                </div>
            )}
            {displayError && <p className="text-xs text-danger">{displayError}</p>}
        </div>
    )
}