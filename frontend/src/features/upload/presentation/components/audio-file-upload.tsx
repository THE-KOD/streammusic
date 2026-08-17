// features/upload/presentation/components/audio-file-upload.tsx
import { useState, useRef, type ChangeEvent } from 'react'
import { Upload, X, FileAudio, CheckCircle2, AlertCircle } from 'lucide-react'
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
        audio.addEventListener('loadedmetadata', () => {
            URL.revokeObjectURL(objectUrl)
            resolve(audio.duration)
        })
        audio.addEventListener('error', () => {
            URL.revokeObjectURL(objectUrl)
            reject(new Error('invalid'))
        })
        audio.src = objectUrl
    })
}

export function AudioFileUpload({ onFileSelect, onRemove, error, disabled }: AudioFileUploadProps) {
    const [file, setFile] = useState<File | null>(null)
    const [duration, setDuration] = useState<number | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (!selected) return
        await processFile(selected)
    }

    const processFile = async (selected: File) => {
        setUploadError(null)

        if (!ACCEPTED_TYPES.includes(selected.type)) {
            setUploadError('Format non supporté — utilise un fichier MP3, OGG ou WAV.')
            return
        }
        if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setUploadError(`Fichier trop volumineux (max ${MAX_FILE_SIZE_MB} Mo).`)
            return
        }

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
        setFile(null)
        setDuration(null)
        setUploadError(null)
        if (inputRef.current) inputRef.current.value = ''
        onRemove()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const dropped = e.dataTransfer.files?.[0]
        if (dropped) processFile(dropped)
    }

    const displayError = error || uploadError

    return (
        <div className="flex flex-col gap-2">
            <input
                type="file"
                accept={ACCEPTED_TYPES.join(',')}
                onChange={handleFileChange}
                ref={inputRef}
                className="hidden"
                id="audio-upload"
                disabled={disabled || isUploading}
            />

            {!file && !isUploading ? (
                <label
                    htmlFor="audio-upload"
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={clsx(
                        'flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200',
                        displayError
                            ? 'border-danger bg-danger/5'
                            : isDragging
                                ? 'border-teal bg-teal/5 scale-[1.02]'
                                : 'border-white/10 hover:border-teal hover:bg-surface/50',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    <div className="relative">
                        <div className={clsx(
                            'w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200',
                            isDragging ? 'bg-teal/20' : 'bg-surface-raised'
                        )}>
                            <Upload className={clsx(
                                'w-8 h-8 transition-colors',
                                isDragging ? 'text-teal' : 'text-muted'
                            )} />
                        </div>
                        {isDragging && (
                            <div className="absolute -inset-1 rounded-full border-2 border-teal/50 animate-pulse" />
                        )}
                    </div>
                    <div className="text-center">
            <span className="font-body text-sm text-ivory">
              {isDragging ? 'Relâchez pour déposer' : 'Sélectionner un fichier audio'}
            </span>
                        <p className="text-xs text-muted mt-1">MP3, OGG, WAV — 20 Mo max</p>
                    </div>
                </label>
            ) : isUploading ? (
                <div className="flex flex-col items-center justify-center gap-3 p-6 border border-white/10 rounded-xl bg-surface-raised">
                    <Spinner size="md" />
                    <span className="font-body text-sm text-ivory">Analyse du fichier...</span>
                </div>
            ) : (
                <div className="flex items-center gap-4 p-4 border border-teal/30 rounded-xl bg-surface-raised/50 transition-all duration-200">
                    <div className="w-12 h-12 rounded-lg bg-teal/20 flex items-center justify-center shrink-0">
                        <FileAudio className="w-6 h-6 text-teal" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-body text-sm text-ivory truncate">{file?.name}</p>
                        <div className="flex items-center gap-3 mt-0.5 text-xs">
              <span className="text-muted font-mono">
                {(file?.size || 0) / 1024 / 1024 > 1
                    ? `${((file?.size || 0) / 1024 / 1024).toFixed(1)} Mo`
                    : `${Math.round((file?.size || 0) / 1024)} Ko`}
              </span>
                            {duration !== null && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-muted/30" />
                                    <span className="text-muted font-mono">
                    {formatDuration(duration)}
                  </span>
                                </>
                            )}
                            <span className="w-1 h-1 rounded-full bg-muted/30" />
                            <span className="text-teal flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Valide
              </span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemove}
                        aria-label="Retirer le fichier"
                        className="text-muted hover:text-danger shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            )}

            {displayError && (
                <div className="flex items-center gap-2 text-xs text-danger">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{displayError}</span>
                </div>
            )}
        </div>
    )
}